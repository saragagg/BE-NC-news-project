# Northcoders News API

## Set up your environment variables

In order to access the necessary environment variables, make sure to create two .env files (one for the development database and one for the test database). For the dev data, create a file named .env.development and add PGDATABASE=*add database name* into it. For the test data crate a file named .env.test and add PGDATABASE=*add database name* into it. You can find the correct database name in the setup.sql file in the db folder. Make sure both .env files are.gitignored. 