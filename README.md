
# CRM Service

Template serverless web service to manage customers and users from a CRM-like system, ready for AWS Cloud provider deployment and Continuous Integration.


## Features

- Infrastructure as Code;
- CI/CD;
- CRUD operations;
- Cognito authentication;
- Custom JWT (Web Token) authorization for Admins;
- DynamoDB database integration;
- Image manipulation, storage and management;
- 100% unit test coverage;

# Getting Started

Fork this project and follow the following steps to deploy the complete stack to your AWS account.

## Deployment

Add the following secrets to the project with the respective IAM or root user credentials from your AWS account:

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

Then run the configured action manually or by pushing to the master branch.



## Environment Variables

To completely deploy this project with every Cloud feature you will need to paste the following environment variables to the project "ENV" secret after a successful deploy from the previous step, as you would do in a .env file:

`POOL_CLIENT_ID`

`USER_POOL_ID`

`USER_POOL_ARN`

Note that it's only after a successful deploy since these won't have been generated yet, and will be accessible via the Amazon Console interface afterwards.

Follow this same step over for adding new variables in the future.

## Usage

To validate the newly deployed endpoints, visible in the end of the Deploy segment in the actions tab, you'll need an user account from Cognito to be able to generate and retrieve an authentication token to use as the Authorization header of the request. One way the authentication token may be retrieved is via a Sign-in page, configured and accessed via the Cognito interface.



## Run Locally

Clone the project

```bash
  git clone git@github.com:tpellegrin/crm-service.git
```

Go to the project directory

```bash
  cd crm-service
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  sls offline
```


## Running Tests

To run tests, run the following command:

```bash
  npm run test
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

