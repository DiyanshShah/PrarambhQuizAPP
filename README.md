# Programming Quiz Application

A real-time quiz application for testing programming knowledge with admin controls and participant management.

## Features

- **User Authentication**
  - Sign up and login functionality
  - Secure token-based authentication
  - Admin and participant roles

- **Admin Dashboard**
  - Start/End test controls
  - Participant management
  - Real-time test status monitoring
  - Ability to kick participants

- **Quiz System**
  - Multiple programming languages (Python, C)
  - Real-time question timer
  - Score tracking
  - Waiting room for participants
  - Automatic test state management

- **Security Features**
  - Protected admin routes
  - Secure authentication
  - Participant validation
  - Test state validation

## Tech Stack

- **Frontend**
  - React.js
  - Framer Motion (Animations)
  - CSS Modules

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create environment files:
   - Create `.env` file in the backend directory:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Seed the database:
   ```bash
   cd backend
   npm run seed-admin
   npm run seed-test-state
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Default Admin Credentials

- Email: diyansh@gmail.com
- Password: admin@123

## Project Structure

```
project/
├── backend/
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── scripts/        # Database seeding scripts
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx     # Main App component
│   │   └── App.css     # Global styles
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Admin Routes
- `GET /api/admin/test-state` - Get current test state
- `POST /api/admin/start-test` - Start the test
- `POST /api/admin/end-test` - End the test
- `GET /api/admin/participants` - Get all participants
- `POST /api/admin/kick/:userId` - Kick a participant

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped in the development of this project
- Special thanks to the open-source community for their invaluable tools and libraries
