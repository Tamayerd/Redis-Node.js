import { createClient } from 'redis';
const client = createClient();
await client.connect();


export default class ConfigurationsController {
  // Display list of all Configurationss.
  static async list(req, res) {
    try {
      const fields = await client.hGetAll('config-session:1');
      let parsedFields = {};

    parsedFields = Object.fromEntries(
      Object.keys(fields).map(key => [key, JSON.parse(fields[key])])
    );

    
    res.send(parsedFields)
    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configurations Controller List: " + error.message);
    }
  }

  // Display detail page for a specific Configurations.
  static async detail(req, res) {
    try {
      let configKey;
      let dbcCollection;
      let canRequestMessagesCollection;
      let canCollectionName;
      let canRequestCollectionName;

      const id = req.params.id;

      const configData = await client.hGetAll('config-session:1');
      const CanDbcCollections = await client.hGetAll('candbcollections-session:1');
      const canRequestMessagesColl = await client.hGetAll('canrequestmessagescoll-session:1' );
     
      if (configData !== null && configData !== undefined) {
          for (configKey in configData) {
              const configObj = JSON.parse(configData[configKey]);
              //Get id
              const dbcCollectionId = configObj.can_dbc_collection_id;
              const dbcCollectionName = configObj.name
              if (id === dbcCollectionId) {
                
                for (dbcCollection in CanDbcCollections) {
                  const candbcCollection = JSON.parse(CanDbcCollections[dbcCollection]);
                  canCollectionName = candbcCollection.name
                }
            
                for (canRequestMessagesCollection in canRequestMessagesColl) {
                  const canRequestCollection = JSON.parse(canRequestMessagesColl[canRequestMessagesCollection]);
                  canRequestCollectionName = canRequestCollection.name
                }
                const entity = {
                  candbcCollectionName: canCollectionName,
                  canRequestMessagesCollection : canRequestCollectionName,
                  dbcCollectionName :dbcCollectionName
                }
                res.status(200).send(entity);
                break
              }
          }
        
      } else {
          res.send("Nothing to update"); 
      }
    
    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configurations Controller Detail: " + error.message);
    }
  }

  // Display detail page for a specific Configurations.
  static async detail_with_dbc(req, res) {
    try {
        const id = req.params.id;
        const dbc_id = req.params.can_dbc_id;

        const canMessages = await client.hGetAll('canMessages-session:1');
        const canMessageConfig = await client.hGetAll('canMessageConfig-session:1');

        let selectedMessages = [];
     //By comparing the ids coming from params with the ids coming from canMesssage and canMessageConfig, 
     //is_selected: true are send

        if (canMessages && canMessageConfig) {
            for (const configKey in canMessages) {
                const configObj = JSON.parse(canMessages[configKey]);
                const dbcCollectionId = configObj.can_dbc_collection_id;

                if (dbc_id === dbcCollectionId) {
                    for (const dbcCollection in canMessageConfig) {
                        const candMessageConfig = JSON.parse(canMessageConfig[dbcCollection]);
                        const configurationId = candMessageConfig.configuration_id;

                        if (id === configurationId) {
                            for (const canMessageKey in canMessages) {
                                const candMessage = JSON.parse(canMessages[canMessageKey]);
                                if (candMessage.is_selected === true) {
                                    selectedMessages.push(candMessage);
                                }
                            }
                        }
                    }
                }
            }

            if (selectedMessages.length > 0) {
                res.status(200).send(selectedMessages);
            } else {
                res.status(200).send("No selected messages found.");
            }
        } else {
            res.status(200).send("Nothing to update");
        }
    } catch (error) {
        res.status(403).send(error.message);
        console.error("Error At Configurations Controller Detail With DBC: " + error.message);
    }
}

  // Display detail page for a specific Configurations.
  static async detail_with_col(req, res) {
    try {
      const configId =  req.params.id
      const canRequestMessageConf = await client.hGetAll('canrequestmessageconfig-session:1');

      const canReqColId = req.params.can_req_col_id
      const canRequestMessages = await client.hGetAll('canrequestmessages-session:1');
      
      let selectedMessages = [];

      if (canRequestMessages && canRequestMessageConf) {
        for (const configKey in canRequestMessageConf) {  
          const configObj = JSON.parse(canRequestMessageConf[configKey]);
          const reqConfigId = configObj.configuration_id;
          
          if (configId === reqConfigId) {
            for (const canMessageKey in canRequestMessages) {
              const candMessage = JSON.parse(canRequestMessages[canMessageKey]);
              const canMessageId = candMessage.can_request_message_collection_id;
                if(canMessageId === canReqColId && candMessage.is_selected === true){
                    selectedMessages.push(candMessage);
                }
            }
          }
        }
      }
    
      if (selectedMessages.length > 0) {
        res.status(200).send(selectedMessages);
    } else {
        res.status(200).send("No selected messages found.");
    }

    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configurations Controller Detail With Collection: " + error.message);
    }
  }

  // Display a device's active coonfiguration messages.
  static async get_all_active_messages(req, res) {
    try {
    
    const id = req.params.device_id;
    const devices = await client.hGetAll('devices-session:1');
    const canMessageConf = await client.hGetAll('canMessageConfig-session:1');
    const canMessages = await client.hGetAll('canMessages-session:1');
    const staticMessages = await client.hGetAll('staticMessages-session:1');
    
    let reqConfigId;
    let canConfigObj;
    let canMessageId;
  //If the ids in canMessages and canMessagesConf match; Also, if the device's configuration_id and canMessageConf match; 
  //send all static messages and send the selected device.

    if (canMessages && canMessageConf) {
        for (const configKey in canMessageConf) {
            canConfigObj = JSON.parse(canMessageConf[configKey]);
            reqConfigId = canConfigObj.configuration_id;
        }
    
        for (const canMessageKey in canMessages) {
            const candMessage = JSON.parse(canMessages[canMessageKey]);
            canMessageId = candMessage.id;
        
    
        if (reqConfigId === canMessageId) {
            for (const deviceKey in devices) {
                const deviceObj = JSON.parse(devices[deviceKey]);
                const configId = deviceObj.configuration_id;
                if (configId === canConfigObj.configuration_id && id == deviceObj.id) {
                    const combinedMessages = [];
                    for (const staticMessageKey in staticMessages) {
                        const staticMessageObj = JSON.parse(staticMessages[staticMessageKey]);
                        combinedMessages.push(staticMessageObj);
                    }
                    combinedMessages.push(deviceObj);
                    res.send(combinedMessages);
                    break;
                }
              }
            }
        }
    }
    
    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configurations Controller Get All Active Messages: " + error.message);
    }
  }

  // Handle Configurations create on POST.
  static async create_post(req, res) {
    try {
      const name = req.body.name;
      const can_dbc_collection_id = req.body.can_dbc_collection_id;
      const can_request_message_collection_id = req.body.can_request_message_collection_id;
  
    //Unique id for appending
    const fields = await client.hGetAll('config-session:1');
    let maxId = 0;
    let lastUser;
    let newUserId = 1;
    for (const userId in fields) {
      const config = fields[userId];
      const userIdNum = parseInt(userId.replace('config', ''));
      if (userIdNum > maxId) {
          maxId = userIdNum;
          lastUser = config;
          newUserId = parseInt(userId.replace('config', '')) + 1; 
      }
  }
 
   const config = [
    {
      name: name,
      can_dbc_collection_id:can_dbc_collection_id,
      can_request_message_collection_id: can_request_message_collection_id,
     
     }
   ]
    const jsonConfig=  JSON.stringify(config[0])

    //Set new user
    await client.hSet('config-session:1', `config${newUserId}`, jsonConfig );
    //Get new user
    const userValue = await client.hGet('config-session:1', `config${newUserId}`);

    res.status(200).send(JSON.parse(userValue));
    }
    catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configuration Controller Create: " + error.message);
    }
  }

  // Handle Configurations delete on POST.
  static async delete_post(req, res) {
    try {
      let configKey;
      //Deletion is performed according to can_dbc_collection_id
      const id = req.params.id 
      const configData  = await client.hGetAll('config-session:1');

      if(configData !== null || configData !== undefined){
      for (configKey in configData) {
        const configObj = JSON.parse(configData[configKey]);
        //Get collection_id
        const dbcCollectionId = configObj.can_dbc_collection_id;

        if (id === dbcCollectionId) {
          await client.hDel('config-session:1', `${configKey}`);
          res.send("OK");
          return; 
        }
      }
    
      res.send("Nothing to delete");
    } else {
      res.send("Nothing to delete"); 
    }  
    }
    catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Configuration Controller Delete: " + error.message);
    }
  }


  // Display Configurations update form on POST.
  static async update_post(req, res) {
    try {
        let configKey;
        const id = req.params.id;
        const canMessageName = req.body.can_messages_configuration_name;
        const configData = await client.hGetAll('config-session:1');

        if (configData !== null && configData !== undefined) {
            for (configKey in configData) {
                const configObj = JSON.parse(configData[configKey]);
                //Get id
                const dbcCollectionId = configObj.can_dbc_collection_id;

                if (id === dbcCollectionId) {
                  if(  configObj.name !== canMessageName){
                    configObj.name = canMessageName;
                    await client.hSet('config-session:1', `${configKey}`, JSON.stringify(configObj));
                    res.send("OK");
                    return; 
                  }
                }
            }
            res.send("Nothing to update");
        } else {
            res.send("Nothing to update"); 
        }
    } catch (error) {
        res.status(403).send(error.message);
        console.error("Error At Admins Controller Update: " + error.message);
    }
}

}
