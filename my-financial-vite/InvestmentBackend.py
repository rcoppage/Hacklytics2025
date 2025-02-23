from flask import Flask, request, jsonify
import pandas as pd
from stable_baselines3 import PPO
import numpy as np
import gym
from gym import spaces
import requests
import torch
import zipfile
import os
from fredapi import Fred  # Use FRED API

app = Flask(__name__)

# --- Configurations ---
API_KEY_FRED = 'e4cc6320f97f206a3ad166fbdab00b81 '  # Replace with your actual FRED API key
FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'
MODELS_DIR = 'C:\\Users\\ac0119\\PycharmProjects\\YOLOV92'  # Adjust this if your models are in a different directory

# --- Bond Trading ---

# Load the trained models for different bond types
class BondTradingRL:
    def __init__(self):
        model_2year_path = os.path.join(MODELS_DIR, "bond_rl_trader2year.zip")
        model_5year_path = os.path.join(MODELS_DIR, "bond_rl_trader5year.zip")
        model_10year_path = os.path.join(MODELS_DIR, "bond_rl_trader.zip")
        # Ensure files exist before loading
        if not os.path.exists(model_2year_path):
            raise FileNotFoundError(f"Model file not found: {model_2year_path}")
        if not os.path.exists(model_5year_path):
            raise FileNotFoundError(f"Model file not found: {model_5year_path}")
        if not os.path.exists(model_10year_path):
            raise FileNotFoundError(f"Model file not found: {model_10year_path}")

        # Load separate models for 2-year, 5-year, and 10-year bonds
        self.model_2year = PPO.load(model_2year_path)
        self.model_5year = PPO.load(model_5year_path)
        self.model_10year = PPO.load(model_10year_path)

    def predict(self, bond_type, data):
        # Create a DataFrame from the data sent from React
        df = pd.DataFrame([data], columns=["cash_balance", "bonds_owned", "price", "yield", "coupon_rate"])

        # Convert DataFrame to the format the model expects
        state = np.array(df.iloc, dtype=np.float32).reshape(1, -1)  # Use iloc to get the first row

        # Select the correct model based on the bond type
        if bond_type == "twoYear":
            model = self.model_2year
        elif bond_type == "fiveYear":
            model = self.model_5year
        elif bond_type == "tenYear":
            model = self.model_10year
        else:
            raise ValueError(f"Unknown bond type: {bond_type}")

        # Predict action using the selected model
        action, _ = model.predict(state)

        return int(action)

# Initialize the model
bond_trader = BondTradingRL()

# --- Exchange Rate Trading ---

# Load pretrained models from.zip files
def load_model(currency_pair):
    if currency_pair == 'EUR_USD':
        model_path = os.path.join(MODELS_DIR, 'eur_usd_rl_trader.zip')
    elif currency_pair == 'JPY_USD':
        model_path = os.path.join(MODELS_DIR, 'jpy_usd_rl_trader.zip')
    elif currency_pair == 'AUD_USD':
        model_path = os.path.join(MODELS_DIR, 'aud_usd_rl_trader.zip')
    else:
        raise ValueError('Invalid currency pair for model loading')

    # Load the model from the.zip file
    if os.path.exists(model_path):
        model = PPO.load(model_path)
    else:
        raise FileNotFoundError(f'Model file for {currency_pair} not found at {model_path}')

    return model

# Function to fetch exchange rate data (EUR/USD, JPY/USD, AUD/USD)
def fetch_exchange_rate(currency_pair):
    if currency_pair == 'EUR_USD':
        series_id = 'DEXUSEU'  # EUR/USD FRED series ID
    elif currency_pair == 'JPY_USD':
        series_id = 'DEXJPUS'  # JPY/USD FRED series ID
    elif currency_pair == 'AUD_USD':
        series_id = 'DEXUSAL'  # AUD/USD FRED series ID
    else:
        return None

    # Fetch data from FRED API
    response = requests.get(
        FRED_BASE_URL,
        params={
            'series_id': series_id,
            'api_key': API_KEY_FRED,
            'file_type': 'json'
        }
    )

    if response.status_code == 200:
        data = response.json()
        # Get the latest exchange rate
        latest_data = data['observations'][-1]  # Latest observation
        return {
            'currencyPair': currency_pair,
            'exchangeRate': latest_data['value'],
            'date': latest_data['date']
        }
    else:
        return None

# --- Stock Market Trading ---

class StockMarketTradingRL:
    def __init__(self, api_key=API_KEY_FRED):  # Use the global API_KEY_FRED
        # Initialize the environments for Nasdaq and S&P 500
        self.nasdaq_env = StockMarketTradingEnv('NASDAQCOM', api_key)
        self.sp500_env = StockMarketTradingEnv('SP500', api_key)

        # Initialize RL Models for both markets, loading from the specified paths
        self.nasdaq_model = PPO.load(os.path.join(MODELS_DIR, "nasdaq_rl_trader.zip"))
        self.sp500_model = PPO.load(os.path.join(MODELS_DIR, "sp500_rl_trader.zip"))

    def train_model(self, market_type, timesteps=50000):
        """Train the RL model for the selected market type."""
        if market_type == 'nasdaq':
            self.nasdaq_model.learn(total_timesteps=timesteps)
        elif market_type == 'sp500':
            self.sp500_model.learn(total_timesteps=timesteps)
        print(f"Training complete for {market_type}!")

    def predict_action(self, market_type, data):
        """Predict an action (Buy, Sell, Hold) based on input data."""
        if market_type == 'nasdaq':
            action, _ = self.nasdaq_model.predict(self.nasdaq_env._prepare_data(data))
        elif market_type == 'sp500':
            action, _ = self.sp500_model.predict(self.sp500_env._prepare_data(data))
        return action

# Custom Environment for Stock Market Trading
class StockMarketTradingEnv(gym.Env):
    def __init__(self, series_id, api_key):
        super(StockMarketTradingEnv, self).__init__()

        # Fetch stock market data (Nasdaq or S&P 500)
        self.data = self.fetch_market_data(series_id, api_key)
        self.current_step = 0
        self.initial_cash = 10000
        self.cash_balance = self.initial_cash
        self.shares_owned = 0

        # Define action space: 0 = Hold, 1 = Buy, 2 = Sell
        self.action_space = spaces.Discrete(3)

        # Observation space: [cash balance, shares owned, current price]
        self.observation_space = spaces.Box(low=0, high=np.inf, shape=(3,), dtype=np.float32)

    def fetch_market_data(self, series_id, api_key):
        """Fetch market data from FRED."""
        fred = Fred(api_key=api_key)
        data = fred.get_series(series_id)

        if data is None or data.empty:
            raise ValueError(f"Error: No data retrieved for {series_id}. Check API key and internet connection.")

        # Convert to DataFrame
        data = pd.DataFrame(data, columns=['Adj Close'])
        data.index = pd.to_datetime(data.index)
        return data

    def reset(self):
        """Reset the environment for a new episode."""
        self.current_step = 0
        self.cash_balance = self.initial_cash
        self.shares_owned = 0
        return self._get_observation()

    def _get_observation(self):
        """Return the current state observation."""
        price = self.data.iloc[self.current_step]['Adj Close']
        return np.array([self.cash_balance, self.shares_owned, price], dtype=np.float32)

    def _prepare_data(self, data):
        """Prepares data for action prediction."""
        return np.array([self.cash_balance, self.shares_owned, data['price']], dtype=np.float32)

    def step(self, action):
        """Execute the given action and update the environment state."""
        price = self.data.iloc[self.current_step]['Adj Close']

        # Execute buy/sell actions
        if action == 1 and self.cash_balance >= price:  # Buy share
            self.shares_owned += 1
            self.cash_balance -= price
        elif action == 2 and self.shares_owned > 0:  # Sell share
            self.shares_owned -= 1
            self.cash_balance += price

        # Move to next time step
        self.current_step += 1
        done = self.current_step >= len(self.data) - 1

        # Calculate reward based on portfolio value
        portfolio_value = self.cash_balance + (self.shares_owned * price)
        reward = portfolio_value - self.initial_cash

        return self._get_observation(), reward, done, {}

    def render(self):
        """Print the current state of the environment."""
        print(f"Step: {self.current_step}, Cash: {self.cash_balance}, Shares Owned: {self.shares_owned}")

# Initialize the stock trading RL agent
stock_trading_rl = StockMarketTradingRL(api_key=API_KEY_FRED)

# --- Flask Routes ---

@app.route("/predict_bond", methods=["POST"])
def predict_bond():
    # Get data from the request
    data = request.json
    bond_type = data.get("bond_type")  # Get bond type (e.g., 'twoYear', 'fiveYear', 'tenYear')

    # Use the trained model to predict the action (Buy, Sell, or Hold)
    action = bond_trader.predict(bond_type, data)

    # Map the action to a string for easier understanding
    action_map = {0: "Hold", 1: "Buy", 2: "Sell"}
    investment_decision = action_map[action]

    # Return the decision
    return jsonify({"action": investment_decision})

@app.route('/getExchangeData', methods=['GET'])
def get_exchange_data():
    currency = request.args.get('currency')
    if currency not in ['EUR_USD', 'JPY_USD', 'AUD_USD']:
        return jsonify({'error': 'Invalid currency pair requested'}), 400

    data = fetch_exchange_rate(currency)
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'Unable to fetch data for the requested currency pair'}), 500

@app.route('/predict_exchange', methods=['POST'])
def predict_exchange():
    try:
        data = request.get_json()
        currency_pair = data['currencyPair']

        # Load the correct model based on currency pair
        model = load_model(currency_pair)

        # Prepare the observation (for simplicity, using exchangeRate and cash_balance as observation)
        cash_balance = data['cash_balance']
        currency_owned = data['currency_owned']
        price = data['price']

        # Create a mock observation (Replace this with your actual observation format)
        observation = [cash_balance, currency_owned, price]

        # Predict the action using the model
        action, _ = model.predict(observation)

        # Map the action to a human-readable form
        action_map = {0: "Hold", 1: "Buy", 2: "Sell"}
        action_str = action_map.get(action, "Unknown")

        return jsonify({'action': action_str})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict_stock', methods=['POST'])
def predict_stock():
    data = request.get_json()

    market_type = data.get('market_type', 'nasdaq')  # Default to 'nasdaq'
    price = data.get('price')

    if not price:
        return jsonify({'error': 'Price data is required.'}), 400

    # Prepare the data
    market_data = {
        'price': price
    }

    # Predict the action based on market type
    action = stock_trading_rl.predict_action(market_type, market_data)

    action_text = ''
    if action == 0:
        action_text = 'Hold'
    elif action == 1:
        action_text = 'Buy'
    elif action == 2:
        action_text = 'Sell'

    return jsonify({'action': action_text})

if __name__ == '__main__':
    # Make sure the models directory exists
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)

    app.run(debug=True)