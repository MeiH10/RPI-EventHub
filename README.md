# RPI-EventHub

A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
Our site is live at: https://rpieventhub.com/

### Figma Design

Access the project design on Figma:

[View Figma Design](https://www.figma.com/design/v0cNZkxuSuKK9oWbOzVuKc/RPI-EventHub?node-id=0-1&t=eB62svz1oXVUen8N-1)

## Local Development Setup Guide

### Prerequisites

- Ensure Node.js is installed.
- Install npm or yarn for dependency management.

### Special Note for macOS Users

Before starting, disable the AirPlay Receiver on your Mac to avoid port conflicts:
1. Click the **Apple icon** (top-left corner).
2. Navigate to **System Settings.**
3. Search for **AirPlay Receiver** in the search bar.
4. Locate **AirPlay Receiver** and turn it **off.**

### Setup Instructions

**1. Clone the Repository**

```shell
# Clone the repository to your local machine
git clone https://github.com/MeiH10/RPI-EventHub.git
```

**2. Create a .env File for Backend Configuration**
```shell
# Navigate to the project directory
cd RPI-EventHub

# Move to the backend folder
cd rpi-eventhub/backend/

# Create a .env file
touch .env
```

**Sample .env File Content:**
Update the placeholder values (\*\*\*) with your actual credentials.

```text
JWT_SECRET="***"
MONGODB_URI="mongodb+srv://***"
SENDGRID_API_KEY="***"
EMAIL_FROM="rpieventhub@gmail.com"
ImgBB_API_KEY="***"
PG_HOST="***.aivencloud.com"
PG_PORT=***
PG_USER="***"
PG_PASSWORD="***"
PG_DATABASE="***"
IMAGE_PREFIX="https://***.pythonanywhere.com/***/"
AZURE_STORAGE_ACCOUNT_NAME="***"
AZURE_STORAGE_ACCOUNT_KEY="***"
```
**3. Install Dependencies and Run Backend**

```shell
# From the backend directory
npm install

# Start the backend server
npm run start
```
**4. Install Dependencies and Run Frontend**

Open another terminal for the frontend setup:

```shell
# Navigate to the project root directory
cd path/to/RPI-EventHub

# Move to the frontend folder
cd rpi-eventhub/frontend/

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
--------
**Additional Notes**

- Ensure both backend and frontend servers are running simultaneously.
- Access the application locally at the provided development URL from the terminal output.
