import { redisClient } from "./redis-client.js";
import RedisOm from "redis-om";

const { Schema, Repository } = RedisOm;

const devicesSchema = new Schema(
  "Devices",

  {
    device_id: { type: "number" },
    is_latest: { type: "boolean" },
    id: { type: "number", path: "$.latest_log[*].id" },
    can_message_id: {
      type: "number",
      path: "$.latest_log[*].can_message_id",
    },
    data: { type: "string", path: "$.latest_log[*].data" },
    name: { type: "string", path: "$.latest_log[*].name" },
    device_name: { type: "string" },
    customer_group_name: { type: "string" },
    id: { type: "number", path: "$.device_groups[*].id" },
    name: { type: "string", path: "$.device_groups[*].name" },
    data: { type: "string", path: "$.staitic_message[*].data" },
    static_message_id: {
      type: "string",
      path: "$.staitic_message[*].static_message_id",
    },
  },
  {
    dataStructure: "JSON",
  }
);

export const deviceRepository = new Repository(devicesSchema, redisClient);
await deviceRepository.createIndex();

// EXAMPLE MODEL DATA
// let Device = {
//   device_id: 1323,
//   is_latest: true,
//   latest_log: {
//     id: 13213,
//     can_message_id: 131232,
//     data: "data",
//   },
// staitic_message:{
//   data : "data",
//   static_message_id: 1233
// },

//   device_name: "devicename",
//   customer_group_name: "customergroupname",
//   device_groups: { id: 12211, name: "name" },
// };
// deviceRepository.device_id = Device.device_id;
// deviceRepository.is_latest = Device.is_latest;
// deviceRepository.latest_log = Device.latest_log.id;
// deviceRepository.latest_log = Device.latest_log.can_message_id;
// deviceRepository.device_name = Device.device_name;
// deviceRepository.customer_group_name = Device.customer_group_name;
// deviceRepository.device_groups = Device.device_groups.id;
// deviceRepository.device_groups = Device.device_groups.can_message_id;
// deviceRepository.device_groups = Device.device_groups.data;
//Device = await deviceRepository.save(Device);
