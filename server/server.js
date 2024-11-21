const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// CORS-Konfiguration
const corsOptions = {
  origin: 'http://localhost:5500',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Verbunden mit MongoDB");
  } catch (error) {
    console.error("Fehler bei der Verbindung zu MongoDB:", error);
  }
}

connectToMongo();

app.get('/', (req, res) => {
  res.send('Hallo von Express und MongoDB!');
});

app.get('/module', async (req, res) => {
  try {
    const db = client.db("test"); // Ersetzen Sie dies durch Ihren tatsächlichen Datenbanknamen
    const collection = db.collection("module");

    const modules = await collection.find({}).toArray();
    
    res.json(modules); // Sendet die Module als JSON-Antwort
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten:", error);
    res.status(500).send("Interner Serverfehler");
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server läuft auf http://0.0.0.0:${port}`);
});