import { PORT } from './config/env.js';
import { startCronJobs } from './jobs/cron.js';
import { createApp } from './appFactory.js';

const app = createApp();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
  startCronJobs();
  console.log("[cron] Cron jobs iniciados");
});