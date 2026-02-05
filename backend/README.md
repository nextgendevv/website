# Backend API

This is the backend for the website. It is a Node.js application using Express and Mongoose.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file in the root of the backend directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
3.  Start the server:
    ```bash
    npm start
    ```

## API Endpoints

The backend provides the following API endpoints:

-   `/api/auth`: Authentication routes (register, login).
-   `/api/user`: User-related routes (profile, change password, etc.).
-   `/api/deposit`: Deposit-related routes.
-   `/api/withdrawal`: Withdrawal-related routes.
-   `/api/staking`: Staking-related routes.
-   `/api/team`: Team-related routes.

### History Endpoints

The following endpoints are available for fetching user history data. They are all protected and require a valid JWT token in the `Authorization` header.

-   `GET /api/deposit/history`: Fetches the deposit history for the authenticated user.
-   `GET /api/withdrawal/history`: Fetches the withdrawal history for the authenticated user.
-   `GET /api/staking/history`: Fetches the staking history for the authenticated user.
-   `GET /api/staking/rewards`: Fetches the reward history for the authenticated user.

### Withdrawal Request

-   `POST /api/withdrawal/request`: Submits a new withdrawal request for the authenticated user. The request body should contain `amount` and `method`.
