const fs = require('fs');

// Write to a file
fs.writeFile('example.txt', 'Hello, world!', (err) => {
  if (err) throw err;
  console.log('File written successfully!');

  // Read the file
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);

    // Append to the file
    fs.appendFile('example.txt', '\nAppended text.', (err) => {
      if (err) throw err;
      console.log('Data appended successfully!');

      // Read the directory
      fs.readdir('.', (err, files) => {
        if (err) throw err;
        console.log('Files in directory:', files);

        // Clean up: Delete the file
        fs.unlink('example.txt', (err) => {
          if (err) throw err;
          console.log('File deleted successfully!');
        });
      });
    });
  });
});
