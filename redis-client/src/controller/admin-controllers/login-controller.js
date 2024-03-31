import bcrypt from "bcrypt";
import Authorizations from "../../authorization/auth.js"
import { createClient } from 'redis';
import  NodeCache  from "node-cache";

const cache = new NodeCache();
const client = createClient();
await client.connected();

export default class LoginController {
  // Display list of all Adminss.
  static async list(req, res) {
    try {
      const fields = await client.hgetall('user-session:8');
      let parsedFields = {};

    parsedFields = Object.fromEntries(
      Object.keys(fields).map(key => [key, JSON.parse(fields[key])])
    );

    
    res.send(parsedFields)
    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Admins Controller List: " + error.message);
    }
  }

  // Display detail page for a specific Admins.
  static async detail(req, res) {
    try {
      const userId = req.body.id;
      let userData = cache.get(userId);

      if (!userData) {
        
          userData = await client.hGet('user-session:9', `user${userId}`);
          
          cache.set(userId, userData, 100);
          
      }
      
      res.send(JSON.parse(userData));
    } catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Admins Controller Detail: " + error.message);
    }
  }

  // Handle Admins create on POST.
  static async create_post(req, res) {
    try {
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10); 
      const email = req.body.email
  
    //Unique id for appending
    const fields = await client.hgetall('user-session:9');
    let maxId = 0;
    let lastUser;

    for (const userId in fields) {
        const user = JSON.parse(fields[userId]);
        const userIdNum = parseInt(user.id);
        if (userIdNum > maxId) {
            maxId = userIdNum;
            lastUser = user;
        }
    }
    const newUserId = parseInt(lastUser.id) + 1; 
   const user = [
    {
      email: email,
      roles: "1",
      password: hashedPassword,
      id: (newUserId).toString()
     }
   ]
    const jsonUser=  JSON.stringify(user[0])

    //Set new user
    await client.hSet('user-session:9', `user${newUserId}`, jsonUser );
    //Get new user
    const userValue = await client.hget('user-session:9', `user${newUserId}`);

    res.status(200).send(JSON.parse(userValue));
    }
    catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Admins Controller Create: " + error.message);
    }
  }

  // Handle Admins Login on POST.
  static async login_post(req, res) {
    const{email, password} = req.body
  if (!email || !password) {
    return res.status(400).json('You need to provide an email and a password');
}
    try{
      const user =  await Authorizations.login(email, password);
  
    if(user  && req.session.id ){
     
      res.status(200).send("Logged in!");
    }else{
      res.status(403).send(error, "email or password not true");
    }

    }
  catch (error) {
    res.status(403).json('Email or password not true');;
  }
  }

  // Handle Admins Logout on POST.
  static async logout_post(req, res) {
    req.session.destroy((err) => {  if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send(false);
  } else {
      res.send('Logout successful');
  }
});
}

  // Handle Admins delete on POST.
  static async delete_post(req, res) {
    try {
      const id = req.params.id 
      await client.hDel('user-session:9', `user${id}`);
      res.send("OK");
    }
    catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Admins Controller Delete: " + error.message);
    }
  }

  // Display Admins update form on POST.
  static async update_post(req, res) {
    try {
      const id = req.body.id
      const findUser =  await client.hget('user-session:9', `user${id}`);
      const userData = JSON.parse(findUser);
    
      
      if(userData !== null || userData !== undefined){
        const password= req.body.password
        const hashedPassword = await bcrypt.hash(password, 10); 
        userData.password = hashedPassword
        
        //Set updated data 
        await client.hset('user-session:9', `user${id}`, JSON.stringify(userData));

        res.status(200).send("Updated successfully");
      }
    
      else {
        res.status(404).send("Requested ID is not found");
      }
    }
    catch (error) {
      res.status(403).send(error.message);
      console.error("Error At Admins Controller Update: " + error.message);
    }
  }


}

