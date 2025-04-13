# Member Insight Glimpse

## Overview
Member Insight Glimpse is an application with separate client and server components. The application requires MongoDB to be installed on your system. The application provides real-time user activity tracking and analytics through a React frontend interface and Express backend. All activity is reflected immediately on the dashboard in real-time, giving you instant visibility into user behavior.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running on your system

### Server Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

### Client Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
## API Routes

### Authentication Routes
- **POST /auth/login**
  - **Description**: Authenticates a user and creates a login activity record
  - **Required Data**: `email`, `password`
  - **Response**: Returns success message and empty token on success
  - **Notes**: Updates user's login status, increments login count, and broadcasts activity via socket
  - **Dashboard Effect**: Login activity is immediately displayed on the dashboard in real-time

- **POST /auth/logout**
  - **Description**: Logs out the currently authenticated user
  - **Required Data**: `userId` (in request body, params, or query)
  - **Response**: 204 No Content on successful logout
  - **Notes**: Updates user's logout timestamp and broadcasts logout activity via socket
  - **Dashboard Effect**: Logout events instantly update all related metrics and activity feeds

### Tracking Routes
- **POST /track**
  - **Description**: Records user navigation activity on specific routes
  - **Required Data**: `userId`, `route` (page being visited)
  - **Response**: Confirmation message with user's name and visited route
  - **Notes**: Creates a visit activity record and broadcasts visit data via socket
  - **Dashboard Effect**: Page visits are reflected immediately in the analytics dashboard

### Analytics Routes
- **GET /visit-distribution**
  - **Description**: Returns aggregated data about page visit distribution for the current day
  - **Response**: JSON object with routes as keys and visit counts as values
  - **Example**: `{"home": 5, "profile": 3, "settings": 2}`
  - **Dashboard Effect**: Visit distribution charts update in real-time with each new visit

- **GET /stats**
  - **Description**: Retrieves comprehensive daily statistics for user activities
  - **Response**: JSON object containing date-based statistics for logins, logouts, and page visits
  - **Notes**: Data is formatted as an array of daily statistics objects
  - **Dashboard Effect**: Stats cards and graphs refresh immediately when new activity occurs

- **GET /users-per-hour**
  - **Description**: Analyzes login activity to show unique user logins per hour for the current day
  - **Response**: JSON object with hours as keys and unique login counts as values
  - **Example**: `{"09:00": 3, "10:00": 5, "11:00": 2}`
  - **Dashboard Effect**: Hourly login charts automatically update when users log in

- **GET /metrics**
  - **Description**: Flexible endpoint providing various user engagement metrics
  - **Query Parameters**:
    - `activeUsers=true`: Returns count of currently logged-in users
    - `totalLogins=true`: Returns total login count for the day
    - `averageSessions=true`: Returns average session duration in milliseconds
    - `pageVisits=true`: Returns total page visits for the current day
  - **Response**: JSON object containing only the requested metrics
  - **Dashboard Effect**: All metric counters and visualizations update the moment new data is received

## Testing
You can test the application through the frontend interface or directly with the API using tools like:
- Postman
- curl
- Insomnia
- Your browser's developer tools

Any action you take will be immediately visible on the dashboard, allowing you to see the real-time effect of your interactions with the system.
