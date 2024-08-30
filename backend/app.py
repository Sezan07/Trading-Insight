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

@app.route('/stock_data', methods=['GET'])
def stock_data():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = datetime(end.year-1 , end.month, end.day)

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start, end=end)
    stock_name = stock_symbol.split('.')[0]

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    data = [{'x': xi.strftime('%Y-%m-%d'), 'y': yi} for xi, yi in zip(stock_data.index, stock_data['Adj Close'])]
    return jsonify(data)


@app.route('/stock_pc', methods=['GET'])
def stock_pc():
    stock_symbol = request.args.get('stock_name', 'BTC-USD')
    end = datetime.now()
    start = end - timedelta(days=30)  # 30 days ago from today

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start, end=end)

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    start_price = stock_data['Adj Close'].iloc[0]
    end_price = stock_data['Adj Close'].iloc[-1]

    percentage_change = ((end_price - start_price) / start_price) * 100

    return jsonify({'percentage_change': percentage_change})


@app.route('/current_p', methods=['GET'])
def current_p():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = end - timedelta(days=30)  # 30 days ago from today

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start, end=end)

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    start_price = stock_data['Adj Close'].iloc[0]
    end_price = stock_data['Adj Close'].iloc[-1]

    percentage_change = end_price

    return jsonify({'current_price': percentage_change})



@app.route('/stock_d', methods=['GET'])
def stock_d():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = datetime(end.year , end.month-1, end.day)

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start, end=end)
    stock_name = stock_symbol.split('.')[0]

    # Filter out NaN values from the data
    stock_data = stock_data.dropna()

    data = [{'x': xi.strftime('%Y-%m-%d'), 'y': yi} for xi, yi in zip(stock_data.index, stock_data['Adj Close'])]
    return jsonify(data)

@app.route('/daily_return', methods=['GET'])
def daily_return_data():
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start ,end=end)
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
    stock_symbol = request.args.get('stock_name', '^NSEBANK')
    end = datetime.now()
    start = datetime(end.year - 1, end.month, end.day)

    yf.pdr_override()
    stock_data = pdr.get_data_yahoo(stock_symbol, start=start, end=end)
    stock_name = stock_symbol.split('.')[0]

    # Preprocess data for LSTM
    data = stock_data.filter(['Close'])
    dataset = data.values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(dataset)
    training_data_len = int(np.ceil(len(dataset) * .95 ))

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
    plt.title(f"Predictions for {stock_name}")
    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.tight_layout()

    # Save the plot as an image
    image_path = f"{stock_name}_prediction.png"
    plt.savefig(image_path)

    plt.close()  # Close the plot to release resources

    return send_file(image_path, mimetype='image/png')


@app.route('/stock_price', methods=['GET'])
def stock_price():
    stock_name = request.args.get('stock_name')
    if not stock_name:
        return jsonify({"error": "Stock name not provided"}), 400

    try:
        stock = yf.Ticker(stock_name)
        price = stock.history(period="1d")['Close'].iloc[-1]
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
    

    
@app.route('/stock_news', methods=['GET'])
def stock_news():
    # Get the query parameter from the request
    query = request.args.get('query', 'stock market news')
    
    # Google News URL for the query
    url = f"https://www.google.com/search?q={query}&tbm=nws"
    
    try:
        # Send a GET request to Google News URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for any HTTP errors
        
        # Parse the HTML response using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract news headlines and URLs from the search results
        news_articles = []
        for headline in soup.find_all("div", class_="BNeawe vvjwJb AP7Wnd"):
            title = headline.text
            url = headline.find_parent('a')['href']
            
            # Get the content of the article
            article_response = requests.get(url)
            article_response.raise_for_status()
            article_soup = BeautifulSoup(article_response.text, 'html.parser')
            article_text = article_soup.get_text()
            
            # Create a dictionary for the article
            article = {
                "heading": title,
                "text": article_text
            }
            news_articles.append(article)
        
        return jsonify({"success": True, "articles": news_articles})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})




@app.route('/indian_indices', methods=['GET'])
def get_indian_indices():
    # Define URL to fetch data from Yahoo Finance API
    url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EBSESN%2C%5ENSEI%2C%5ENIFTYMCAP100%2C%5ENDX%2C%5EIXIC"

    # Make GET request to fetch data
    response = requests.get(url)

    # Check if request was successful
    if response.status_code == 200:
        # Parse JSON response
        data = response.json()
        # Extract information about each index
        indices = []
        for quote in data['quoteResponse']['result']:
            index_name = quote['shortName']
            last_price = quote['regularMarketPrice']['fmt']
            change = quote['regularMarketChangePercent']['fmt']
            indices.append({'name': index_name, 'price': last_price, 'change': change})
        return indices
    else:
        # If request was unsuccessful, return an empty list
        return []


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
