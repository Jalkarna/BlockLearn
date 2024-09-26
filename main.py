from flask import Flask, request, jsonify
from flask_cors import CORS
from solana.rpc.api import Client
import json

app = Flask(__name__)
CORS(app)  

# Solana testnet client
SOLANA_TESTNET_URL = 'https://api.testnet.solana.com'
client = Client(SOLANA_TESTNET_URL)

# Dummy database for demonstration
user_data = {}

@app.route('/connect-wallet', methods=['POST'])
def connect_wallet():
    data = request.json
    wallet_address = data.get('walletAddress')
    if not wallet_address:
        return jsonify({"error": "Wallet address required"}), 400

    # Check balance or other data
    balance = client.get_balance(wallet_address)
    user_data[wallet_address] = {"balance": balance['result']['value']}

    return jsonify({"message": "Wallet connected", "balance": user_data[wallet_address]}), 200

@app.route('/wallet-info', methods=['GET'])
def wallet_info():
    wallet_address = request.args.get('walletAddress')
    if not wallet_address or wallet_address not in user_data:
        return jsonify({"error": "Wallet address not found"}), 404

    return jsonify({"walletAddress": wallet_address, "data": user_data[wallet_address]}), 200

# Route to handle token transactions (dummy implementation)
@app.route('/transfer-token', methods=['POST'])
def transfer_token():
    data = request.json
    from_wallet = data.get('fromWallet')
    to_wallet = data.get('toWallet')
    amount = data.get('amount')

    if not from_wallet or not to_wallet or not amount:
        return jsonify({"error": "Invalid request parameters"}), 400

    # T ransfer logic  (not implemented)
    # Token transfer logic using Solana's Token Program

    return jsonify({"message": "Token transfer initiated"}), 200

@app.route('/check-wallet', methods=['GET'])
def check_wallet():
    return jsonify({"message": "Please install Phantom wallet to continue"}), 400

if __name__ == '__main__':
    app.run(port=5000)