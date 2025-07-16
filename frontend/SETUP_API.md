# Frontend-Backend API Connection Setup

## Environment Setup

1. **Create `.env` file** in the frontend directory:
```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=SweetShop
VITE_APP_VERSION=1.0.0
```

2. **Start the Backend Server**:
```bash
cd backend
npm install
npm start
```

3. **Start the Frontend Development Server**:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints Available

Based on the Postman collection, the following endpoints are available:

### Health Check
- `GET /health` - Check API status

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create new sweet
- `PUT /api/sweets/:id` - Update sweet
- `DELETE /api/sweets/:id` - Delete sweet

## Frontend Integration

The frontend is now configured to:

1. **Use API Hooks**: All CRUD operations use React Query hooks
2. **Environment Variables**: API URL is configured via `VITE_API_URL`
3. **Type Safety**: Types are aligned between frontend and backend
4. **Error Handling**: Toast notifications for success/error states
5. **Loading States**: Proper loading indicators during API calls

## Testing the Connection

1. Start both servers
2. Open the frontend in your browser
3. Try adding, editing, or deleting sweets
4. Check the browser's Network tab to see API calls
5. Verify data persistence in the backend database

## Troubleshooting

- **CORS Issues**: Backend has CORS enabled for localhost
- **Port Conflicts**: Ensure backend runs on port 3000
- **Database**: Make sure MySQL is running and configured
- **Environment Variables**: Verify `.env` file is in the frontend root 