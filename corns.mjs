
import cron from 'node-cron';
import fs from 'fs';

// corns Syntax 

// * * * * * *
// | | | | | |
// | | | | | └─ Day of the week (0-7; Sunday is both 0 and 7)
// | | | | └── Month (1-12)
// | | | └─── Day of the month (1-31)
// | | └──── Hour (0-23)
// | └───── Minute (0-59)
// └────── Second (0-59) (optional, supported in `node-cron`)

// examples 

// Examples of CRON Expressions:

// */5 * * * * * → Every 5 seconds
// 0 * * * * → At the start of every hour
// 0 9 * * 1-5 → At 9:00 AM, Monday through Friday
// 0 0 1 * * → At midnight on the first day of each month


// Schedule a CRON job
cron.schedule('*/5 * * * * *', () => {
  console.log('Task running every 5 seconds.');

  //  Write to a file
  const now = new Date().toISOString();
  fs.appendFile('cron-log.txt', `Task executed at: ${now}\n`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Log updated.');
    }
  });
});

console.log('CRON Job scheduler started. Tasks will run at their scheduled times.');
