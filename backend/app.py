from flask import Flask, jsonify, request, send_file, redirect, url_for, session
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
import yfinance as yf
import matplotlib
matplotlib.use('agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from pandas_datareader import data as pdr
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pymysql.cursors
import re
from bs4 import BeautifulSoup
import requests
# from datetime import datetime
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app)

app.secret_key = 'xyzsdfg'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'sezan123'
app.config['MYSQL_DB'] = 'stock_login'

# Establish MySQL connection
mysql = pymysql.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    db=app.config['MYSQL_DB'],
    cursorclass=pymysql.cursors.DictCursor
)

# Load the pre-trained LSTM model
model = load_model("model.h5")
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])


@app.route('/')
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST' and 'email' in request.json and 'password' in request.json:
        email = request.json['email']
        password = request.json['password']
        cursor = mysql.cursor()
        cursor.execute('SELECT * FROM user WHERE email = %s AND password = %s', (email, password,))
        user = cursor.fetchone()
        if user:
            session['loggedin'] = True
            session['userid'] = user['id']  # Assuming 'id' is the column name for user identifier
            session['name'] = user['name']
            session['email'] = user['email']
            return jsonify({'success': True, 'name': user['name'], 'redirect': '/StockInputPage'})
        else:
            return jsonify({'success': False, 'message': 'Incorrect email or password'})
    else:
        return jsonify({'success': False, 'message': 'Invalid request'})

@app.route('/get_user_name')
def get_user_name():
    if 'loggedin' in session:
        return jsonify({'success': True, 'name': session.get('name')})
    else:
        return jsonify({'success': False, 'message': 'User not logged in'})


@app.route('/register', methods=['POST'])
def register():
    try:
        # Retrieve user registration data from the request
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Check if all required fields are provided
        if not name or not email or not password:
            return jsonify({'success': False, 'message': 'Please fill out all fields.'}), 400
        
        # Validate email format
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'success': False, 'message': 'Invalid email address.'}), 400

        # Check if the email is already registered
        cursor = mysql.cursor()
        cursor.execute('SELECT * FROM user WHERE email = %s', (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'success': False, 'message': 'Email is already registered.'}), 400

        # Insert new user into the database
        cursor.execute('INSERT INTO user (name, email, password) VALUES (%s, %s, %s)', (name, email, password,))
        mysql.commit()

        return jsonify({'success': True, 'message': 'User registered successfully.'}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('userid', None)
    session.pop('email', None)
    return redirect(url_for('login'))


# 



@app.route('/stock_pc', methods=['GET'])
def stock_pc():
    stock_symbol = request.args.get('stock_name', 'BTC-USD')
    end = datetime.now()
    start = end - timedelta(days=30)  # 30 days ago from today

    # Fetch stock data directly using yfinance
    stock_data = yf.download(stock_symbol, start=start, end=end)

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    # Extract the start and end prices as float
    start_price = float(stock_data['Adj Close'].iloc[0])
    end_price = float(stock_data['Adj Close'].iloc[-1])

    # Calculate percentage change
    percentage_change = ((end_price - start_price) / start_price) * 100

    # Return percentage change as a JSON response
    return jsonify({'percentage_change': percentage_change})


@app.route('/current_p', methods=['GET'])
def current_p():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = end - timedelta(days=30)  # 30 days ago from today

    stock_data = yf.download(stock_symbol, start=start, end=end)

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    start_price = stock_data['Adj Close'].iloc[0]
    end_price = stock_data['Adj Close'].iloc[-1]

    # Ensure that percentage_change is a float, not a pandas.Series
    percentage_change = float(end_price)  # Convert to float

    return jsonify({'current_price': percentage_change})


@app.route('/stock_d', methods=['GET'])
def stock_d():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    
    # Get current date and subtract 1 month to get the start date
    end = datetime.now()
    start = end - relativedelta(months=1)  # Get data from the last month

    # Download stock data using Yahoo Finance
    stock_data = yf.download(stock_symbol, start=start, end=end)

    # Log the raw stock data to check its content
    # print("Raw Stock Data:")
    # print(stock_data.head())  # Log first few rows to console
    # print("Columns in Stock Data:")
    # print(stock_data.columns)  # Check if 'Adj Close' column exists

    if stock_data.empty:
        return jsonify({"error": "No data available for this stock symbol."}), 404

    # Access 'Adj Close' using multi-level column indexing
    adjusted_close = stock_data[('Adj Close', stock_symbol)]  # Adjusting for multi-level column index

    # Prepare the data in the correct format
    data = [{'x': xi.strftime('%Y-%m-%d'), 'y': yi} for xi, yi in zip(adjusted_close.index, adjusted_close)]

    # Log the processed data
    # print("Processed Data to be returned:")
    # print(data)

    return jsonify(data)


@app.route('/daily_return', methods=['GET'])
def daily_return_data():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    # yf.pdr_override()
    stock_data =  yf.download(stock_symbol, start=start ,end=end)
    stock_name = stock_symbol.split('.')[0]

    # Calculate daily return
    stock_data['Daily Return'] = stock_data['Adj Close'].pct_change()

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    # Creating histogram with 50 bins
    hist, bins = np.histogram(stock_data['Daily Return'], bins=50)
    bin_centers = 0.5 * (bins[:-1] + bins[1:])
    
    # Round off bin_centers to 3 decimals
    bin_centers = np.round(bin_centers, 3)
    
    # Convert int32 to int and then to Python list for JSON serialization
    hist = hist.astype(int).tolist()

    daily_return_data = [{'x': round(bin_center, 3), 'y': hist_val} for bin_center, hist_val in zip(bin_centers, hist)]
    return jsonify(daily_return_data)

@app.route('/stock_prediction', methods=['GET'])
def stock_prediction():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')  # 'stock_symbol' is defined here
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    # Fetch data using yfinance
    try:
        print(f"Fetching data for {stock_symbol} from {start} to {end}")
        stock_data = yf.download(stock_symbol, start=start, end=end)
        if stock_data.empty:
            print(f"No data fetched for {stock_symbol} from {start} to {end}")
            return jsonify({'error': f"No data found for stock symbol {stock_symbol}"}), 400
        
        # Check columns
        print("Columns in stock data:", stock_data.columns)
        if 'Close' not in stock_data.columns:
            print(f"'Close' column is missing for {stock_symbol}")
            return jsonify({'error': "'Close' column is missing in the stock data"}), 400
        
        # Print first few rows of the 'Close' column to verify data
        print(stock_data[['Close']].head())

    except Exception as e:
        print(f"Error fetching stock data: {str(e)}")
        return jsonify({'error': f"Error fetching stock data: {str(e)}"}), 500

    # Preprocess data for LSTM
    try:
        data = stock_data[['Close']]  # Directly select 'Close' column
        print("Dataset after filtering:", data.head())  # Verify filtered data

        # Check for missing values
        if data.isnull().sum().any():
            print("Found missing values in the 'Close' column")
            data = data.dropna()  # Drop rows with missing values
        
        dataset = data.values
        if len(dataset) == 0:
            print("Dataset is empty.")
            return jsonify({'error': "Dataset is empty"}), 400

        # Scaling the data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(dataset)
        
    except Exception as e:
        print(f"Error during data preprocessing: {str(e)}")
        return jsonify({'error': f"Error during data preprocessing: {str(e)}"}), 500
    training_data_len = int(np.ceil(len(dataset) * .95))

    train_data = scaled_data[0:int(training_data_len), :]
    x_train, y_train = [], []
    for i in range(60, len(train_data)):
        x_train.append(train_data[i-60:i, 0])
        y_train.append(train_data[i, 0])
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Making predictions
    test_data = scaled_data[training_data_len - 60:, :]
    x_test = []
    y_test = dataset[training_data_len:, :]
    for i in range(60, len(test_data)):
            x_test.append(test_data[i-60:i, 0])
    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
    predictions = model.predict(x_test)
    predictions = scaler.inverse_transform(predictions)

    # Plotting predictions
    train = data[:training_data_len]
    valid = data[training_data_len:]
    valid['Predictions'] = predictions
    plt.figure(figsize=(10, 6))
    plt.plot(train['Close'])
    plt.plot(valid[['Close', 'Predictions']])
    plt.legend(['Train', 'Val', 'Predictions'], loc='lower right')
    plt.title(f"Predictions for {stock_symbol}")  # Changed from stock_name to stock_symbol
    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.tight_layout()

    # Save the plot as an image
    image_path = f"{stock_symbol}_prediction.png"  # Changed from stock_name to stock_symbol
    plt.savefig(image_path)

    plt.close()  # Close the plot to release resources

    return send_file(image_path, mimetype='image/png')


@app.route('/stock_price', methods=['GET'])
def stock_price():
    stock_name = request.args.get('stock_name')
    
    # Check if stock_name is provided
    if not stock_name:
        return jsonify({"error": "Stock name not provided"}), 400

    try:
        # Fetch stock data using Yahoo Finance
        stock = yf.Ticker(stock_name)
        stock_data = stock.history(period="1d")
        
        # Check if data is available for the stock
        if stock_data.empty:
            return jsonify({"error": f"No data found for stock symbol {stock_name}"}), 400

        # Fetch the closing price of the latest trading day
        price = stock_data['Close'].iloc[-1]
        return jsonify({"price": price})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/stock_info', methods=['GET'])
def stock_info():
    stock_symbol = request.args.get('stock_name')
    if not stock_symbol:
        return jsonify({"error": "Stock name not provided"}), 400

    try:
        stock = yf.Ticker(stock_symbol)
        info = stock.info
        basic_info = {
            "symbol": info.get("symbol"),
            "company_name": info.get("longName"),
            "closing_price": info.get("regularMarketPreviousClose"),
            "market_cap": info.get("marketCap"),
            "volume": info.get("volume"),
            "average_volume": info.get("averageVolume"),
            "profit_margin": info.get("profitMargins"),
            "EBITDA": info.get("ebitda")
        }
        return jsonify(basic_info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    



@app.route('/funds', methods=['GET'])
def get_funds():
    fund_type = request.args.get('type')
    sort_by = request.args.get('sortBy', 'fund_name')
    sort_order = request.args.get('sortOrder', 'asc')
    if fund_type == 'smallcap':
        if sort_by == 'fund_size':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM smallcap_fundsize ORDER BY fund_size DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM smallcap_fundsize ORDER BY fund_size ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        elif sort_by == 'annual_return':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM smallcap_fundsize ORDER BY annual_return DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM smallcap_fundsize ORDER BY annual_return ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        else:
            try:
                cursor = mysql.cursor()
                cursor.execute('SELECT * FROM smallcap_fundsize')
                smallcap_funds = cursor.fetchall()
                return jsonify({'success': True, 'funds': smallcap_funds})
            except Exception as e:
                return jsonify({'success': False, 'message': str(e)}), 500        
                     
    elif fund_type == 'midcap':
        if sort_by == 'fund_size':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM midcap_fundsize ORDER BY fund_size DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM midcap_fundsize ORDER BY fund_size ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        elif sort_by == 'annual_return':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM midcap_fundsize ORDER BY annual_return DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM midcap_fundsize ORDER BY annual_return ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        else:
            try:
                cursor = mysql.cursor()
                cursor.execute('SELECT * FROM midcap_fundsize')
                smallcap_funds = cursor.fetchall()
                return jsonify({'success': True, 'funds': smallcap_funds})
            except Exception as e:
                return jsonify({'success': False, 'message': str(e)}), 500    
    elif fund_type == 'largecap':
        if sort_by == 'fund_size':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM largecap_fundsize ORDER BY fund_size DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM largecap_fundsize ORDER BY fund_size ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        elif sort_by == 'annual_return':
            if sort_order == 'desc':
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM largecap_fundsize ORDER BY annual_return DESC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
            else:
                try:
                    cursor = mysql.cursor()
                    cursor.execute('SELECT * FROM largecap_fundsize ORDER BY annual_return ASC')
                    smallcap_funds = cursor.fetchall()
                    return jsonify({'success': True, 'funds': smallcap_funds})
                except Exception as e:
                    return jsonify({'success': False, 'message': str(e)}), 500
        else:
            try:
                cursor = mysql.cursor()
                cursor.execute('SELECT * FROM largecap_fundsize')
                smallcap_funds = cursor.fetchall()
                return jsonify({'success': True, 'funds': smallcap_funds})
            except Exception as e:
                return jsonify({'success': False, 'message': str(e)}), 500    

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


   
    
if __name__ == '__main__':
    app.run(debug=True)