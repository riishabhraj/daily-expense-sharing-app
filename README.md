# Daily Expenses Sharing Application
This is the backend for a Daily Expenses Sharing Application, built with Node.js, Express, and MongoDB. 
The application allows users to add expenses and split them among participants based on three different 
methods: Equal, Exact, and Percentage. It also supports generating a balance sheet of expenses and downloading 
it as a CSV file.

## Features
- **User Management**:  
  Create users with email, name, and mobile number.

- **Expense Management**:  
  Add expenses and split them using one of the three methods:  
  - **Equal Split**: Split expenses equally among all participants.  
  - **Exact Split**: Specify the exact amount each participant owes.  
  - **Percentage Split**: Split expenses based on percentage ownership.

- **Balance Sheet**:  
  Retrieve individual and overall expenses, and download the balance sheet in CSV format.

- **Error Handling**:  
  Input validation for correct data processing.

## Technologies Used
- **Backend**:  
  Node.js, Express

- **Database**:  
  MongoDB (using Mongoose ODM)

- **Environment Variables**:  
  dotenv

- **CSV Generation**:  
  json2csv

- **Development Tools**:  
  nodemon


## Getting Started
• Prerequisites
Ensure you have the following installed on your machine:

Node.js (v12 or higher)
MongoDB (or use a cloud database like MongoDB Atlas)

## Installation
Clone the Repository:

``` bash
git clone https://github.com/riishabhraj/daily-expense-sharing-app.git
cd daily-expenses-sharing-app
```

## Install Dependencies:

``` bash
npm install
```

## Set Up Environment Variables:

Create a .env file in the root directory and configure the following variables:

``` bash
PORT=3000
DB_URI=your_mongodb_connection_string
```

## Run the Application:

You can run the application using nodemon for live-reloading during development:

``` bash
npm start
```

The server will be available at http://localhost:3000.

## Project Structure
Here’s the overall structure of the project:

``` bash
daily-expenses-sharing-app/
├── controllers/        # Contains business logic for users and expenses
│   ├── userController.js
│   └── expenseController.js
├── models/             # Mongoose models for MongoDB collections
│   ├── User.js
│   └── Expense.js
├── routes/             # API route definitions
│   ├── userRoutes.js
│   └── expenseRoutes.js
├── .env                # Environment variables (DB connection string, port)
├── app.js              # Main entry point for the application
├── README.md           # This documentation
├── package.json        # Project metadata and dependencies
└── .gitignore          # Ignored files (e.g., node_modules)
```

## API Endpoints and Logic Explanation
## User Management
1. Create a User
Endpoint: POST /api/users/create
Description: Creates a new user with name, email, and mobile number.
Request Body:

``` json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890"
}
```

Response:

``` json
{
  "_id": "uniqueUserId",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "__v": 0
}
```

## Logic:
The request body is validated to ensure the presence of required fields (name, email, mobile).
A new user is created using Mongoose's save() method and stored in the MongoDB collection.
2. Get User Details
Endpoint: GET /api/users/:id
Description: Retrieve details of a specific user using their ID.
Response:

``` json
{
  "_id": "uniqueUserId",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "__v": 0
}
```

Logic:
The user ID is extracted from the URL and a query is run on the database using Mongoose’s findById() method.
If the user exists, the user data is returned; otherwise, an error response is sent.
3. Update User Details (Optional)
Endpoint: PUT /api/users/:id
Description: Updates the details of an existing user (e.g., update mobile number).
Request Body:

``` json
{
  "mobile": "9999988888"
}
``` 
Logic:
The findByIdAndUpdate() method is used to update a user’s details by their ID. The new data is returned in the response.
Expense Management
1. Add an Expense
Endpoint: POST /api/expenses/add
Description: Adds a new expense and splits it among participants based on the chosen method.
Request Body (Equal Split Example):

``` json
{
  "totalAmount": 3000,
  "splitMethod": "equal",
  "participants": [
    { "userId": "user1Id" },
    { "userId": "user2Id" },
    { "userId": "user3Id" }
  ]
}
```

Response:

``` json
{
  "message": "Expense added successfully",
  "expense": {
    "_id": "uniqueExpenseId",
    "totalAmount": 3000,
    "splitMethod": "equal",
    "participants": [
      { "userId": "user1Id", "amount": 1000 },
      { "userId": "user2Id", "amount": 1000 },
      { "userId": "user3Id", "amount": 1000 }
    ],
    "__v": 0
  }
}
```

Logic:
The splitMethod can be equal, exact, or percentage.
Depending on the split method, different logic is applied to calculate how much each participant owes:
Equal Split: The total amount is divided equally among participants.
Exact Split: The exact amount each participant owes is specified in the request.
Percentage Split: The total is divided based on percentage ownership provided in the request.
After the amounts are calculated, the expense is saved in MongoDB.
2. Get Expenses for a Specific User
Endpoint: GET /api/expenses/user/:userId
Description: Retrieves all expenses where the user was a participant.
Response:

``` json
[
  {
    "_id": "uniqueExpenseId",
    "totalAmount": 3000,
    "splitMethod": "equal",
    "participants": [
      { "userId": "user1Id", "amount": 1000 },
      { "userId": "user2Id", "amount": 1000 },
      { "userId": "user3Id", "amount": 1000 }
    ]
  }
]
```

Logic:
The user ID is used to filter the expenses where they are listed as a participant. Mongoose’s find() method is used to query expenses with matching participants.
3. Get Overall Expenses
Endpoint: GET /api/expenses/overall
Description: Retrieves all recorded expenses in the system.
Response:

``` json
[
  {
    "_id": "uniqueExpenseId",
    "totalAmount": 3000,
    "splitMethod": "equal",
    "participants": [
      { "userId": "user1Id", "amount": 1000 },
      { "userId": "user2Id", "amount": 1000 },
      { "userId": "user3Id", "amount": 1000 }
    ]
  }
]
```

Logic:
All expenses stored in the system are returned using find({}).
Balance Sheet Generation
1. Download Balance Sheet
Endpoint: GET /api/expenses/balance-sheet

Description: Generates and downloads the balance sheet as a CSV file.

Logic:

The balance sheet is generated by querying all the expenses and formatting them into a CSV format using the json2csv library.
The CSV file is sent back as an attachment in the response.
Error Handling
Input Validation: Validations are added to check the correctness of the data (e.g., email format, required fields, percentage summing to 100).
Error Messages: Clear error messages are returned for invalid inputs or missing data. For instance:
Invalid split method: "Invalid split method"
Exact amounts don’t match total: "Exact amounts do not add up to total"
Percentage doesn’t total 100: "Percentages do not add up to 100%"
Testing with Postman
Use the following API routes to test your backend in Postman:

- **Create a User**:  
  - `POST /api/users/create`

- **Get User Details**:  
  - `GET /api/users/:id`

- **Add Expense (Equal Split)**:  
  - `POST /api/expenses/add`

- **Get Expenses for User**:  
  - `GET /api/expenses/user/:userId`

- **Get Overall Expenses**:  
  - `GET /api/expenses/overall`

## Download Balance Sheet:
• GET /api/expenses/balance-sheet

## Future Improvements
- **Authentication**: Implement user authentication and authorization.
- **Unit Tests**: Add unit and integration tests for better coverage.
- **Performance**: Optimize database queries and application performance for large datasets.
