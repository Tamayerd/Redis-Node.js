import { deviceRepository as repository } from "../repository.js";

export default class DevicesController {


    
  static async saveDevice(req) {
    try {
      const savedDeviceIds = new Set();

      for (const deviceData of req.body) {
        if (!deviceData || Object.keys(deviceData).length === 0) {
          continue;
        }

        const deviceId = deviceData.device_id;

        if (savedDeviceIds.has(deviceId)) {
          continue;
        }

        const Device = {
          device_id: deviceId,
          is_latest: deviceData.is_latest,
          latest_log: {
            id: deviceData.id,
            can_message_id: deviceData.can_message_id,
            name: deviceData.name || null,
            data: deviceData.data,
          },
        };

        await repository.save(`${deviceId}`, Device);

        savedDeviceIds.add(deviceId);
        let dev = await repository
          .search()
          .where("device_id")
          .equals(deviceData.device_id)
          .return.all();

        console.log(`Device with ID ${deviceId} saved successfully.`);
      }
    } catch (error) {
      console.error("Error saving device:", error);
    }
  }

  static async staticMessageLogs(req) {
    try {
      const savedDeviceIds = new Set();

      for (const deviceData of req.body) {
        if (!deviceData || Object.keys(deviceData).length === 0) {
          continue;
        }

        const deviceId = deviceData.device_id;

        if (savedDeviceIds.has(deviceId)) {
          continue;
        }

        const Device = {
          device_id: deviceId,
          latest_log: {
            static_message_id: deviceData.static_message_id,
            data: deviceData.data,
          },
        };

        await repository.save(`${deviceId}`, Device);

        savedDeviceIds.add(deviceId);
        // let dev = await repository
        //   .search()
        //   .where("device_id")
        //   .equals(deviceData.device_id)
        //   .return.all();
      }
    } catch (error) {
      console.error("Error saving device:", error);
    }
  }

  static async device_locations(req, res) {
    try {
      const params = req.params;
      let dev = await repository
        .search()
        .where("device_id")
        .equals(params.device_id)
        .return.all();

      return dev;
    } catch (error) {
      console.error("Error saving device:", error);
      throw error;
    }
  }
}
