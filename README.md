## Project Description

- A backend project built in NodeJs containing all API endpoints to be consumed by a front end. The project was built to simulate BGs main workflow process

## Endpoints Available

### User

User Signup - /user/signup -POST METHOD
User login -/user/login -POST METHOD

### Operators

get states - /operator/states -GET METHOD
get LGAs - /operator/states/:state_id/lgas -GET METHOD
Select Product & seed type - /operator/productselection -POST METHOD
Operator profile completion - /operator/completeregistration -POST METHOD

### Admin

verify operator - /admin/verifyoperator/:operator_regid -GET METHOD

## How to run the app

-Clone the repo
-Open cloned folder and run `npm install`

- Create a new database in postgres called `bgTapProject1`

  -Run `npx db-migrate up` to run the migrations
  -Run `npm run dev` to run the scripts and start the server. After running this the first time, you can now run `npm start` going forward instead
  -Use a postman tool to interact with the endpoints. Visit any of the endpoints above with the correct request method
