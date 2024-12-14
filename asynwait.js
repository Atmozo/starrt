
const fs = require('fs').promises;

// Function to simulate a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Dynamically import fetch
async function fetchDataFromAPI(url) {
  const fetch = await import('node-fetch');
  try {
    const response = await fetch.default(url); //  .default because of the ES module export
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('API Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Read a file using async/await
async function readFile() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log('File contents:', data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

// Fetch multiple API endpoints in parallel
async function fetchMultipleDataInParallel() {
  try {
    const [data1, data2] = await Promise.all([
      fetchDataFromAPI('https://jsonplaceholder.typicode.com/todos/1'),
      fetchDataFromAPI('https://jsonplaceholder.typicode.com/todos/2')
    ]);
    
    console.log('Fetched Data 1:', data1);
    console.log('Fetched Data 2:', data2);
  } catch (error) {
    console.error('Error fetching multiple data:', error);
  }
}

// Use delay to simulate async operation with a timeout
async function performTaskWithDelay() {
  console.log('Task started');
  await delay(2000); // Wait for 2 seconds
  console.log('Task completed after delay');
}

// Main function to combine everything
async function main() {
  // Perform all async tasks
  await performTaskWithDelay();
  await readFile();
  await fetchMultipleDataInParallel();
}

main();
