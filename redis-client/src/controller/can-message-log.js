import { deviceRepository as repository } from "../repositories.js";

export default class DevicesControllerRedis {
  //CanMessagesLogsController, create_post
  static async saveDevice(req) {
    try {
      // Initialize an empty Set to store unique device IDs
      const savedDeviceIds = new Set();

      for (const deviceData of req.body) {
        if (!deviceData || Object.keys(deviceData).length === 0) {
          continue;
        }

        const deviceId = deviceData.device_id;

        // Check if the device ID has already been saved
        if (savedDeviceIds.has(deviceId)) {
          continue;
        }

        // Prepare the Device object to be saved
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

        // Add the device ID to the savedDeviceIds set to mark it as saved
        savedDeviceIds.add(deviceId);
      }
    } catch (error) {
      console.error("Error saving device:", error);
    }
  }

  //StaticMessageLogsController, create_post
  static async saveLogs(req) {
    try {
      // Initialize an empty Set to store unique device IDs
      const savedDeviceIds = new Set();

      for (const deviceData of req.body) {
        if (!deviceData || Object.keys(deviceData).length === 0) {
          continue;
        }

        const deviceId = deviceData.device_id;

        // Check if the device ID has already been saved
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

        // Add the device ID to the savedDeviceIds set to mark it as saved
        savedDeviceIds.add(deviceId);
      }
    } catch (error) {
      console.error("Error saving device:", error);
    }
  }

  //LogsController, device_latest_logs
  static async getDeviceLocations(req, res) {
    try {
      const params = req.params;
      const DEVICE_ID = "device_id";
      let deviceLocations = await repository
        .search()
        .where(DEVICE_ID)
        .equals(params.device_id)
        .return.all();

      return deviceLocations;
    } catch (error) {
      console.error("Error saving device:", error);
      throw error;
    }
  }
}
