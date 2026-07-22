import cron from "node-cron";
import { releaseExpiredReservations } from "../modules/stock/services.js";
import logger from "../common/utils/logger.js";

export function startCronJobs() {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const result = await releaseExpiredReservations();
      if (result.released > 0) {
        logger.info(`[cron] ${result.released} reservas liberadas ao estoque`, {
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      logger.error(`[cron] Erro ao liberar reservas: ${(e as Error).message}`, {
        timestamp: new Date().toISOString(),
      });
    }
  });
}