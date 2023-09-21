# Running Odin Locally

This guide will walk you through the steps to run the Odin frontend and backend locally.

## Frontend Setup

### 1. Clone the Repository

### 2. Navigate to odin-ui directory
- cd odin-ui

### 3. Install Dependencies
- npm install
- In the root directory create .env file and add: REACT_APP_MAPBOX_TOKEN= 'your_mapbox_token'
- In the root directory create .env.development file and add: REACT_APP_API_BASE_URL=http://localhost:8000

### 4. Run the Frontend Application
- npm start
- Open your browser and navigate to http://localhost:3000

## Backend Setup (FastAPI)

### 1. Navigate to odin-api directory
- cd odin-api

### 2. Set up a Virtual Environment
- virtualenv venv
- source venv/bin/activate # On Windows use `venv\Scripts\activate`

### 3. Install Dependencies
- pip install -r requirements.txt

### 4. Run the Backend Server
- uvicorn main:app --reload
- Open your browser and navigate to:
    - http://localhost:8000/api/sar_image
    - http://localhost:8000/api/lighthouses 


For the deployment plan, check [here](./deployment_plan.md).