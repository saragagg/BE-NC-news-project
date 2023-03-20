# Northcoders News API

## What is Northcoders News API?
The NC News API is a RESTful API which serves data for a news articles website. The data is stored in a PostgreSQL database, which we can interact with via node-postgres. 

## Link to the hosted version of this API:

https://nc-newsapp.onrender.com/api

## Istructions:
## Step 1 - Clone the repository
Open your terminal and change the current working directory to the directory you want to clone the repo in. Run the following command in the terminal: 
```
git clone https://github.com/saragagg/BE-NC-news-project.git
```

## Step 2 - Install the required dependencies 
In the working directory where you cloned the repository, open the terminal and run the following command: 
```
npm install 
```

## Step 3 - Create the local database 
In order to create the database, run the following script in the terminal: 
```
npm run setub-dbs
```

## Step 5 - Seed local database 
In order to create the tables and populate them with the data from the local db file, run the following script in the terminal: 
```
npm run seed
```

## How to run tests
This API has been developed using test-driven development (TDD) with Jest for unit testing and Supertest for http requests. All the tests can be found in the __tests__. To run a test type the following command in the terminal and press enter: 
```
npm test
```

## Set up your environment variables
In order to access the necessary environment variables, make sure to create two .env files (one for the development database and one for the test database). For the dev data, create a file named .env.development and add PGDATABASE=*add database name* into it. For the test data create a file named .env.test and add PGDATABASE=*add database name* into it. You can find the correct database name in the setup.sql file in the db folder. Make sure both .env files are.gitignored. 

## Requirements to run this API
```
- Node.js v18.13.0
- PostgreSQL psql 14.7 
```