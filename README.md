
# Track Meta Finder

Track Meta Finder is a web application that helps users manage metadata related to their tracks. This project is built using Vue.js for the frontend, Node.js/Express for the backend, and MongoDB for the database.

## Table of Contents

- [Project Setup](#project-setup)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Getting MongoDB Credentials](#getting-mongodb-credentials)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)

## Project Setup

To set up the project, run the following command:

```bash
npm install
```

### Compiles and Hot-Reloads for Development

To start the development server, use:

```bash
npm run serve
```

### Compiles and Minifies for Production

To build the application for production, run:

```bash
npm run build
```

### Lints and Fixes Files

To lint and fix files, use:

```bash
npm run lint
```

### Customize Configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Installation

To get started with Track Meta Finder, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/track-meta-finder.git
   ```

2. Navigate to the project directory:

   ```bash
   cd track-meta-finder
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Environment Setup

To run the application, you'll need to configure the environment variables. These variables are required for setting up MongoDB, JWT authentication, and the API connection.

1. **Create an `.env` file**:
   
   A sample `.env.example` file is included in the project. Copy this file and rename it to `.env`:

   ```bash
   cp .env.example .env
   ```

2. **Fill in the required environment variables**:

   Open the `.env` file and provide the necessary values:

   - `DB_USERNAME`: Your MongoDB database username.
   - `DB_PASSWORD`: Your MongoDB database password.
   - `DB_NAME`: The name of your MongoDB database.
   - `JWT_SECRET`: A secret key for signing JWT tokens.
   - `REFRESH_TOKEN_SECRET`: A secret key for signing refresh tokens.
   - `VUE_APP_API_URL`: The URL of your backend API.

   Example `.env` file:
   ```bash
   EXPRESSPORT=3000
   MONGOOSEPORT=27017
   DB_USERNAME="your-db-username-here"
   DB_PASSWORD="your-db-password-here"
   DB_NAME="your-db-name-here"
   JWT_SECRET="your-jwt-secret-here"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret-here"
   VUE_APP_API_URL="http://localhost:3000/login"
   ```

   **Important**: Never commit your `.env` file to version control. It contains sensitive information such as passwords and API keys. Ensure it's listed in the `.gitignore` file.

## Getting MongoDB Credentials

If you don't have MongoDB credentials yet, follow these steps to set up MongoDB:

1. **Create a MongoDB Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
   
2. **Create a New Cluster**: Once signed in, create a new cluster and configure it based on your needs. A free tier is available for development purposes.

3. **Create a Database User**: In the Security section, add a new database user with the following permissions:
   - **Username**: Set this as the `DB_USERNAME`.
   - **Password**: Set this as the `DB_PASSWORD`.

4. **Whitelisting IP Addresses**: Whitelist your IP address or allow access from anywhere to connect to your cluster.

5. **Get Connection String**: Once your cluster is ready, MongoDB will provide a connection string like the following:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
   Replace `<username>`, `<password>`, and `<dbname>` with your actual values and add them to your `.env` file.

For more detailed steps, refer to the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/getting-started/).

## Running the Application

1. **Start the backend server**:

   ```bash
   npm run dev
   ```

   The backend server should now be running on `http://localhost:3000`.

2. **Start the frontend** (if needed):

   If the frontend is a separate project, start the Vue.js app (ensure `VUE_APP_API_URL` points to the correct backend URL).

## Contributing

Feel free to contribute to this project. To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

Please ensure that your code follows the project’s code style and includes relevant tests if applicable.
