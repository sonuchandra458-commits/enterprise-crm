# Enterprise CRM

Full-stack CRM system built with React.js, Node.js, MongoDB.

## Features
- Lead tracking & deal pipeline
- Sales performance dashboard
- Activity & email logs
- Role-based access control (Admin/Manager/Sales/Viewer)

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT tokens

## Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables
Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/enterprise-crm
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```
