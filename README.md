# HatchMobile Frontend
The backend repo is available at: https://github.com/aniJani/hatchBackend
HatchMobile is a mobile application built with **React Native** and **Expo** that allows users to collaborate on projects, manage goals and tasks, and interact through chat and invitations. The app integrates with **Firebase** for authentication and communicates with a backend API for project management, invitations, and other services.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Project Structure Details](#project-structure-details)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration & Sign-In:** Secure account creation and authentication using Firebase.
- **Project Management:** Create new projects, generate task divisions through AI integration, edit project details, and assign tasks.
- **Collaboration:** Invite collaborators and receive invitations; manage collaborator profiles and assignments.
- **Chat Functionality:** Real-time project chat with support for AI-assisted suggestions.
- **Organizations:** Create, join, and manage organizations to group users.
- **Matchmaking:** Find and suggest potential collaborators based on user skills and project requirements.
- **Responsive UI:** A visually engaging and dark-themed user interface built using React Native components.

## Tech Stack

- **React Native & Expo:** Building cross-platform mobile applications.
- **Firebase:** Authentication and real-time data persistence.
- **React Navigation:** For navigating between screens.
- **Axios:** For API requests and backend communication.
- **Environment Variables:** Managed via `react-native-dotenv` for configuring API endpoints and Firebase settings.
- **Other Libraries:** React Native Paper, AsyncStorage, and additional UI libraries for improved design and user experience.

## Directory Structure

The project follows a modular structure. Below is an overview of the main directories and files:

```
anijani-hatchmobile/
├── App.js                # Entry point and navigation setup
├── app.json              # Expo configuration settings
├── babel.config.js       # Babel configuration including environment variable setup
├── firebase.js           # Firebase configuration and initialization
├── package.json          # Project dependencies and scripts
├── assets/               # Images, icons, and splash screens for the app
├── components/           # Reusable UI components (chat modal, collaborator selection, goal cards, etc.)
├── contexts/             # Context providers (e.g., auth context)
├── screens/              # Main screens/routes (Dashboard, Project Detail, User Profile, etc.)
└── services/             # API communication and helper functions (chat, project services, invitation services, etc.)
```

## Installation

Before running the application, please ensure you have installed [Node.js](https://nodejs.org/) (LTS version recommended) and [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/anijani-hatchmobile.git
   cd anijani-hatchmobile
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```


## Configuration

### Environment Variables

Create a `.env` file in the project root to define your environment-specific variables. For example:

```ini
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
BASE_URL=your_backend_api_base_url
```

The project uses `react-native-dotenv` (configured in `babel.config.js`) to import these values into your application.

## Usage

After installing dependencies and setting up your environment variables, you can start the development server using Expo.

1. **Start the Expo server:**


   ```bash
   expo start
   ```

2. Follow the on-screen instructions to run the app on an emulator, simulator, or your mobile device.

## Available Scripts

In the project directory, you can run:

- **Start Development Server:**

  ```bash
  npm start
  ```

- **Run on Android:**

  ```bash
  npm run android
  ```

- **Run on iOS:**

  ```bash
  npm run ios
  ```

- **Run on Web:**

  ```bash
  npm run web
  ```

These scripts are defined in the `package.json` file.

## Project Structure Details

- **App.js:** Sets up navigation (stack and tab navigation) based on the authentication state. It initializes the `AuthProvider` to share authentication status across the app.
- **contexts/auth.js:** Defines the authentication context for managing user authentication and persistence using Firebase.
- **screens/**: Each file inside represents a screen or a route in the app, e.g., DashboardScreen, SignInScreen, RegisterScreen, etc.
- **components/**: Contains reusable UI components like chat modals, collaborator selection modals, search modals, and goal cards.
- **services/**: Contains modules for making HTTP requests to your backend API for various features including user services, project management, chat functionalities, invitation handling, and organization management.

## Troubleshooting

- **Environment Variables Not Loading:**  
  Ensure that you have created a `.env` file in the project root and that your `babel.config.js` is correctly configured to use `react-native-dotenv`.

- **Firebase Configuration Issues:**  
  Double-check your Firebase credentials in the `.env` file and ensure that your Firebase project settings match the ones provided in your configuration.

- **API Requests Failing:**  
  Verify that your backend server is running at the URL provided in the `BASE_URL` environment variable.

## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your feature or bug fix, and create a pull request with a detailed description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).
