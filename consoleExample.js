
console.log("Hello, this is a log message!");
// Log an error message
console.error("Oops! Something went wrong.");
// Log a warning message
console.warn("Warning! Check your input.");
// Measure execution time
console.time("Loop Time");
for (let i = 0; i < 1000000; i++) {
  // Simulating a loop
}
console.timeEnd("Loop Time");
// Print a stack trace
const myFunction = () => {
  console.trace("Stack trace example");
};
myFunction();
