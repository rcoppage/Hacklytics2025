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
    return client.db('UserFinance');  // Database
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Test connection route
app.get('/test', async (req, res) => {
  try {
    const db = await connectToMongo();
    console.log('Test connection successful to UserFinance database');
    res.json({ message: 'Connected to MongoDB!' });
  } catch (error) {
    console.error('Test connection failed:', error);
    res.status(500).json({ error: 'Failed to connect to MongoDB' });
  }
});

// Store financial data
app.post('/store-financial-data', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    const db = await connectToMongo();
    const payments = db.collection('Payments');  //Collection
    
    const { 
      userId, 
      username, 
      salary, 
      monthlyRent, 
      groccerySpending,
      transportationCost,
      insuranceCost 
    } = req.body;

    if (!userId || !username) {
      console.log('Missing user information');
      return res.status(400).json({ 
        success: false, 
        error: 'User information is required' 
      });
    }

    const userData = {
      userId: userId,
      email: username,
      financialInfo: {
        salary: Number(salary) || 0,
        monthlyRent: Number(monthlyRent) || 0,
        groccerySpending: Number(groccerySpending) || 0,
        transportationCost: Number(transportationCost) || 0,
        insuranceCost: Number(insuranceCost) || 0,
      },
      lastUpdated: new Date()
    };

    const totalMonthlyExpenses = 
      Number(monthlyRent) + 
      Number(groccerySpending) + 
      Number(transportationCost) + 
      Number(insuranceCost);

    userData.financialInfo.totalMonthlyExpenses = totalMonthlyExpenses;
    userData.financialInfo.monthlyIncome = Number(salary) / 12;
    userData.financialInfo.monthlySavings = (Number(salary) / 12) - totalMonthlyExpenses;

    console.log('Attempting to store in Payments collection:', userData);

    const result = await payments.updateOne(
      { userId: userId },
      { $set: userData },
      { upsert: true }
    );

    console.log('MongoDB operation result:', result);

    res.json({
      success: true,
      message: 'Data stored successfully',
      monthlyExpenses: totalMonthlyExpenses,
      monthlySavings: userData.financialInfo.monthlySavings
    });

  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store data'
    });
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