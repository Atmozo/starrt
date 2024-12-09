const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'testdb';
const collectionName = 'users';

let db, collection;

// Function to perform initial CRUD operations
const performInitialCrudOperations = async () => {
  try {
    console.log('Performing initial CRUD operations...');

    // **1. Create (Insert Documents)**
    const newUsers = [
      { name: 'Ashely', age: 18, email: 'a.com' },
      { name: 'who', age: 17, email: 'who.com' },
      { name: 'what', age: 17, email: 'what.com' },
      { name: 'when', age: 17, email: 'when.com' },
      { name: 'who', age: 17, email: 'who.com' },
    ];
    const insertResult = await collection.insertMany(newUsers);
    console.log('Inserted documents:', insertResult.insertedIds);

    // **2. Read (Find Documents)**
    // Find all users
    const users = await collection.find().toArray();
    console.log('All users:', users);

    // Find a user by name
    const user = await collection.findOne({ name: 'Alice' });
    console.log('Found user:', user);

    // **3. Update (Modify Documents)**
    const updateResult = await collection.updateOne(
      { name: 'Alice' }, // Filter
      { $set: { age: 26 } } // Update operation
    );
    console.log('Updated document:', updateResult.modifiedCount);

    // **4. Delete (Remove Documents)**
    const deleteResult = await collection.deleteOne({ name: 'Bob' });
    console.log('Deleted document:', deleteResult.deletedCount);
  } catch (err) {
    console.error('Error performing CRUD operations:', err);
  }
};


(async () => {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the database and collection
    db = client.db(dbName);
    collection = db.collection(collectionName);

    // Perform initial CRUD operations
    await performInitialCrudOperations();

    console.log(`\nMongoDB is running and ready for CRUD operations in the terminal.`);
    console.log(`\nTry using \`db\` or \`collection\` in the terminal.`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
})();
