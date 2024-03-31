import { reportsRepository as repository } from "../repositories.js";
import { EntityId } from "redis-om";

export default class ReportController {
  static async get_redis(req, res) {
    try {
      const startDate = req.body["start_date"];
      const endDate = req.body["end_date"];
      const device_id_from_req = req.body["device_id"];
      const columnsToQuery = req.body["message_ids"];

      const DEVICE_ID = "device_id";
      const ID = "id";

      const filteredData = await repository
        .search()
        .where(DEVICE_ID)
        .equals(device_id_from_req)
        .and(ID)
        .equals(columnsToQuery)
        .return.all();

      const matchingData = filteredData.filter((item) => {
        const allLogs = item.logs[0];
        const allDates = Array.isArray(allLogs.created_at)
          ? allLogs.created_at
          : [allLogs.created_at];

        const allCreatedAt = allDates.every(
          (date) => date >= startDate && date <= endDate
        );

        return allCreatedAt;
      });

      return matchingData;
    } catch (error) {
      console.error("Error saving report:", error);
      throw error;
    }
  }

  static async create_redis(req, res, result) {
    try {
      if (!Array.isArray(result) || result.length === 0) {
        return;
      }
      let collectData = [];
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const processLogs = (logs) => {
        return logs.map((log) => ({
          created_at: new Date(log.created_at)
            .toISOString()
            .split(":")
            .slice(0, -1)
            .join(":"),
          data: log.data,
        }));
      };

      const addToCollectData = (report, logs) => {
        const logsData = processLogs(logs);
        collectData.push({
          id: report.id,
          name: report.name,
          device_id: report.device_id,
          logs: logsData,
        });
      };

      const addLogsToCollectData = (reports) => {
        reports.forEach((report) => {
          addToCollectData(report, report.logs);
        });
      };

      addLogsToCollectData([result[0], result[1]]);

      //Batching for big data
      const BATCH_SIZE = 300;
      const promises = [];

      for (let i = 0; i < collectData.length; i += BATCH_SIZE) {
        const batch = collectData.slice(i, i + BATCH_SIZE);
        batch.forEach((item) => {
          promises.push(
            repository.save(item).then((items) => {
              const id = items[EntityId];
              const now = new Date();
              const oneMonthLater = new Date(now);
              oneMonthLater.setMonth(now.getMonth() + 1);
              return repository.expire(
                id,
                Math.floor((oneMonthLater.getTime() - now.getTime()) / 1000)
              );
            })
          );
        });
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error saving report:", error);
      throw error;
    }
  }
}
