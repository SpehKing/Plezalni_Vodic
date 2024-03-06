require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');


// define MONOGO_URI in .env file
//const localMongoURI = process.env.MONGO_LOCAL_URI;

// Make .env file and add the database username and password
const atlasMongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.lxt4ie6.mongodb.net/lp5?retryWrites=true&w=majority`;

//mongoose.connect(localMongoURI);
mongoose.connect(atlasMongoURI);

mongoose.connection.on("connected", () =>
  console.log(`Mongoose connected to ${atlasMongoURI}.`)
);

mongoose.connection.on("error", (err) =>
  console.log(`Mongoose connection error: ${err}.`)
);

mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

// Graceful shutdown for Mongoose connection
const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => process.kill(process.pid, "SIGUSR2"));
});

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    console.log('Closing Mongoose connection due to app termination.');
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  gracefulShutdown("Cloud-based app shutdown", () => {
    console.log('Closing Mongoose connection due to Cloud-based app shutdown.');
    process.exit(0);
  });
});


let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    // Use the localMongoURI for local development
    //const client = new MongoClient(localMongoURI);
    // Uncomment and use the atlasMongoURI for MongoDB Atlas
    const client = new MongoClient(atlasMongoURI);
    await client.connect();
    db = client.db(); // Specify your database name if it's not in the connection string.
    //console.log(db);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// temporary testing function???
async function getAllDocuments(collectionName) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(collectionName);
    const documents = await collection.find({}).toArray();
    return documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  getAllDocuments,
};
