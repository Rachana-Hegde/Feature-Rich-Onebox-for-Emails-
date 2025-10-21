ReachInbox OneBox

A feature-rich email dashboard built with React (frontend) and Node.js/Express (backend), allowing users to view, filter, and analyze their emails from multiple providers (Gmail, Outlook, Yahoo) in one place.

Features

View emails from multiple providers in a unified dashboard.

Filter emails by provider (Gmail, Outlook, Yahoo).

Display latest 3 emails sorted by date.

AI-powered email categorization (based on aiCategory).

Refresh emails manually.

Clean and responsive UI using React.

Tech Stack

Frontend: React, TypeScript, CSS

Backend: Node.js, Express, CORS

API: RESTful API for fetching emails

Optional: AI categorization logic

Database: JSON file or MongoDB (depending on implementation)

Prerequisites

Node.js >= 14

npm >= 6

React >= 18

Installation
1. Backend Setup
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev   # or use node index.js


The backend will run at: http://localhost:5000

API endpoint for emails: http://localhost:5000/api/emails

⚠️ Make sure to enable CORS in Express to allow frontend requests.

2. Frontend Setup
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start


The frontend will run at: http://localhost:3000

Automatically fetches emails from backend API.

Usage

Open the app in your browser.

Select the email provider from the dropdown.

Click Refresh to fetch the latest emails.

View emails in the dashboard with AI categories displayed.

Project Structure
/backend
  ├─ index.js            # Backend entry point
  ├─ routes/
  │   └─ emails.js       # API route for emails
  └─ package.json

/frontend
  ├─ src/
  │   ├─ components/
  │   │   └─ EmailList.tsx
  │   ├─ pages/
  │   │   └─ HomePage.tsx
  │   ├─ App.tsx
  │   └─ index.tsx
  └─ package.json

API Example

GET /api/emails

{
  "data": [
    {
      "id": "1",
      "from": "example@gmail.com",
      "to": ["user@domain.com"],
      "subject": "Welcome!",
      "body": "Hello, this is a test email.",
      "date": "2025-10-21T09:00:00Z",
      "aiCategory": "Promotion"
    }
  ]
}

Dependencies

Backend:

express

cors

nodemon (dev)

Frontend:

react

react-dom

typescript

Tips & Troubleshooting

Emails not loading:

Check backend is running (localhost:5000/api/emails)

Ensure CORS is enabled

Verify API response structure matches frontend expectations

Customizing providers:

Update the dropdown in HomePage.tsx

Update filtering logic in loadEmails

License

This project is licensed under the MIT License.
