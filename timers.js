
const timeoutId = setTimeout(() => {
  console.log("This message appears after 3 seconds.");
}, 2000);


const intervalId = setInterval(() => {
  console.log("This message repeats every 2 seconds.");
}, 2000);


setTimeout(() => {
  console.log("Stopping the timeout and interval...");
  clearTimeout(timeoutId);
  clearInterval(intervalId);
}, 9000);
