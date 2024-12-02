console.log("Directory Name:", __dirname);
console.log("File Name:", __filename);

setTimeout(() => {
  console.log("Timeout executed!");
}, 1000);

const intervalId = setInterval(() => {
  console.log("Interval running...");
}, 500);

setTimeout(() => {
  clearInterval(intervalId);
  console.log("Interval cleared!");
}, 3000);

console.log("Command-line arguments:", process.argv);
