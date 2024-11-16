# Project Setup Instructions

This guide will help you set up and run the project by installing the required dependencies for both the **backend** (Flask) and **frontend** (React).

## Prerequisites

Before proceeding, ensure you have the following installed on your system:
- **Python** (3.6 or above)
- **pip** (Python package manager)
- **Node.js** (includes npm - Node Package Manager)

---

## Setup Instructions

### 1. Create and Activate a Virtual Environment (Backend)

1. Open a terminal or command prompt and navigate to the project root directory.
2. Create a virtual environment inside the `myenv` folder:
   ```bash
   python -m venv myenv
   ```
3. Activate the virtual environment:
   - On **Windows**:
     ```bash
     myenv\Scripts\activate
     ```
   - On **Linux/macOS**:
     ```bash
     source myenv/bin/activate
     ```

### 2. Install Backend Dependencies

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### 3. Install Frontend Dependencies

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

---

### 4. Run the Application

#### Start the Backend (Flask Server)
1. Make sure your virtual environment is activated.
2. Navigate to the `backend` directory:
   ```bash
   cd ../backend
   ```
3. Start the Flask server:
   ```bash
   flask run
   ```

#### Start the Frontend (React Application)
1. Open a new terminal or command prompt.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

### 5. Access the Application

- Open your web browser and navigate to:
  ```
  http://localhost:3000
  ```

- The React frontend will interact with the Flask backend running on:
  ```
  http://localhost:5000
  ```

---

## Additional Notes

- To deactivate the virtual environment:
  ```bash
  deactivate
  ```

- If you encounter any issues, ensure you have the correct versions of Python, pip, and Node.js installed.

---

## File Structure

```
project-root/
│
├── backend/          # Backend folder (Flask app)
│   ├── requirements.txt  # Backend dependencies
│
├── frontend/         # Frontend folder (React app)
│   ├── package.json      # Frontend dependencies
│
├── myenv/            # Virtual environment folder
│
├── README.md         # This file
├── frontend_requirements.txt
```

---

### Automated Setup (Optional)

You can use the provided installation scripts to automate the setup process:

1. Run the Frontend:
    cd frontend
    npm install react react-dom axios chart.js chartjs-plugin-zoom
    
2. For Backend :
    pip install -r requirements.txt

These scripts will:
- Create and activate a virtual environment.
- Install backend dependencies.
- Install frontend dependencies.
