# Conmo, Personal Finances WebApp

Welcome to the Conmo web application project! This application allows you to manage your finances efficiently through graphical displays and intuitive tables. Below, you will find all the information you need to understand, configure and contribute to this project.

## Main features

- **Income and Expense Management**: Record and classify your financial transactions for better tracking.
- **Reserves and Savings**: Set aside part of your income for future major expenses and classify them.
- **Graphical Displays**: Access interactive graphs that give you a clear view of your spending and income patterns.
- **Charts**: Explore your data in detail using tables.

## Trial User Credentials

If you prefer to explore the application without the need to register, you can use the following demo user credentials in 
https://sample-service-name-ivq4.onrender.com/ :

- User: testuser
- Password: testuser

These credentials will allow you to access the application and experiment with its functionalities without the need to create a personal account.

> Please note that these are demo credentials and do not contain any real financial information. Enjoy exploring Conmo!


## Installation

> It is recomended to install the backend first, make sure you have Python 3.8, Pipenv and a database engine (Posgress recomended)

### Back-End Installation:

> If you use Github Codespaces or Gitpod this template will already come with Python, Node and the Posgres Database installed.
> If you are working locally make sure to install Python 3.10, Node 

1. Install the python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database, rename the BACKEND_URL variable on the `./src/.env`
4. Migrate the migrations: `$ pipenv run migrate` (skip if you have not made changes to the models on the `./src/api/models/`)
5. Run the migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`


### Front-End Manual Installation:

> Make sure you are using node version 14+ and that you have already successfully installed and runned the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`

## Contribution

We welcome contributions! If you wish to contribute to this project, please follow these steps:

1. Perform a fork of the repository.
2. Create a branch for your contribution: `$ git checkout -b feature/new-functionality`.
3. Make your changes and commit with descriptive messages.
4. Push to your branch: `$ git push origin feature/new-feature`.
5. Open a pull request and describe your changes.

## Problems and Improvements
If you encounter any problems or have suggestions to improve the application, please open an issue in the repository.

Thanks for contributing!
