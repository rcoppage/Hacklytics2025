import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://reececoppage:CZmdYV91jpRWgUlf@financial.oqy1f.mongodb.net/?retryWrites=true&w=majority&appName=Financial";
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Test connection route
app.get('/test', async (req, res) => {
  try {
    const db = await connectToMongo();
    res.json({ message: 'Connected to MongoDB!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to MongoDB' });
  }
});

// Store prompt data
app.post('/store-prompt', async (req, res) => {
  try {
    const db = await connectToMongo();
    const prompts = db.collection('prompts');
    
    const promptData = {
      prompt: req.body.prompt,
      timestamp: new Date()
    };

    const result = await prompts.insertOne(promptData);
    console.log('Stored prompt:', promptData);
    res.json({ message: 'Prompt stored successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error storing prompt:', error);
    res.status(500).json({ error: 'Failed to store prompt' });
  }
});

// Get all stored prompts
app.get('/prompts', async (req, res) => {
  try {
    const db = await connectToMongo();
    const prompts = db.collection('prompts');
    
    const allPrompts = await prompts.find({}).toArray();
    res.json(allPrompts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve prompts' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle cleanup when server shuts down
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

app.post('/store-financial-data', async (req, res) => {
  try {
    const db = await connectToMongo();
    const financialData = db.collection('financial_data');
    
    const { userId, username, salary, monthlyRent, monthlyDebt } = req.body;

    // Create the document to store
    const userData = {
      userId,
      username,
      salary: Number(salary) || 0,
      monthlyRent: Number(monthlyRent) || 0,
      monthlyDebt: Number(monthlyDebt) || 0,
      timestamp: new Date()
    };

    // Check if user already exists and update if they do
    const result = await financialData.updateOne(
      { userId: userId },
      { $set: userData },
      { upsert: true } // Creates new document if it doesn't exist
    );

    res.json({ 
      success: true, 
      message: 'Financial data stored successfully'
    });
  } catch (error) {
    console.error('Error storing financial data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store financial data' 
    });
  }
});