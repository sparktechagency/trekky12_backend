# Trekky12 Backend

This is the backend server for Trekky12, featuring comprehensive user authentication including traditional email/password, Google OAuth, and Apple Sign In.

## Features

- User registration and login with email/password
- Phone number authentication option
- Google OAuth integration
- Apple Sign In integration
- JWT-based authentication
- Token blacklisting for secure logout
- Role-based authorization (admin/user)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/trekky12

# JWT
JWT_SECRET=your_jwt_secret_key_replace_this_with_a_strong_random_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple Sign In
APPLE_CLIENT_ID=your.app.bundle.id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key_path_or_content

# For password reset/email verification (optional)
EMAIL_FROM=noreply@yourapp.com
SENDGRID_API_KEY=your_sendgrid_api_key

# For SMS/phone verification (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Start the server: `npm run dev`

## Setting up OAuth Credentials

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set up the OAuth consent screen
6. Create Web Application credentials
7. Add your authorized redirect URIs (e.g., `http://localhost:3000/api/auth/google/callback`)
8. Copy the Client ID and Client Secret to your `.env` file

### Apple Sign In

1. Go to the [Apple Developer Portal](https://developer.apple.com/)
2. Register your App ID with the "Sign In with Apple" capability
3. Create a Services ID for your web app
4. Configure your domain and return URLs
5. Create a private key for Sign In with Apple
6. Copy your Team ID, Services ID, Key ID, and download the private key
7. Add these details to your `.env` file

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/phone and password
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/apple` - Login with Apple
- `POST /api/auth/logout` - Logout (requires authentication)

## User Model Update

The User model has been updated to support multiple authentication methods:

- Added `googleId` and `appleId` fields
- Added `authProvider` field that tracks the user's primary authentication method
- Made password optional for social login users
- Retained support for email and/or phone number

## Implementation Notes

For client-side implementation:

1. **Google Auth**: Use the Google Sign-In button from Google's official library
2. **Apple Auth**: Use the Apple Sign In button from Apple's Sign In JS library
3. **Logout**: Send a POST request to `/api/auth/logout` with the JWT token in the Authorization header
