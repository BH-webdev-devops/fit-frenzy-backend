# FitFrenzy Backend

**FitFrenzy, a fitness track application, is a backend application designed to manage user authentication, profiles,  workouts, motivational quotes. This application is built with TypeScript and Node.js and it uses Docker for containerization and Google Cloud Run for deployment.**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Express.js**: Nodejs with express framework for building APIs
- **Postgres**: Relational database for storing and managing user and workout data
- **Docker**: Containerization to deploy the application on GCP
- **Google Cloud Platform**: For deployment
- **Swagger**: API documentation 

### Tools and Libraries
- **jsonwebtoken**: Authentication using JSON Web Tokens (JWT)
- **dotenv**: Environment Variables Management
- **bcryptjs**: Secure password hashing
- **cors**: secure cross-origin resource sharing


## Key features

- User authentication
  - **Sign Up**: Allows users to create a new account by providing necessary details such as username, email and password.
  - **Login**: Enables users to access their account by entering their credentials (email and password)
  - **Forgot Password**: Provides a way for users to reset their password if they have forgotten it, typically through email and birthdate verification.

- Profile management
  - Users can add and manage their profile details, such as name, email, profile picture, age, gender, weight, height.

- Workout logging
  - **Add, Edit, Remove workout details**: Users can keep track of their workouts by logging details such as exercise type, exercise name, duration, date. They can also modify or delete existing workout entries.
  Based on provided information, burnt calories are calculated in the backend.
  reference: https://www.nutristrategy.com/caloriesburned.htm

- Filter Workouts
  - Users can filter workouts based on various Date Ranges: Users can filter their workout logs to view entries within specific date ranges.
  - Custom date filters: Users can apply custom date filters to view workouts within a user-defined date range.

- Pagination
    - The workout data is divided into smaller, manageable pages. Users can request specific pages of data, reducing the load time and improving performance with limit set to 9 by default.

- Admin role
    - **View, Delete users**: Only users with admin role has access to view all the users and their profile. If required, user can all delete the user profile.

- Community Blog
    - In order to connect all the users together, a user can post a message and other users can reply to it.
    All posts are visible to all the users.
    - User can delete or update only their posts and replies.


## Installation

Pre-requisites:
- Node.js (>= 16.x)
- Postgres SQL
  deployment on Cloud (optional)
    - GCP with necessary permissions
    - Docker

Clone the repository:

```
git clone https://github.com/yourusername/fitfrenzy-backend.git
cd fitfrenzy-backend
```

Install dependencies:

`npm install`

Set up environment variables: Create a .env file in the root directory and add the necessary environment variables as specified in the Environment Variables section.

## Usage

To start the development server, run:

`npm run dev`

To build the project, run:

`npm run build`

To start the production server, run:

`npm start`

If you are running it on local, access the application at:

`http://localhost:<port>`

You can test and use APIs using swagger at

`http://localhost:<port>/api-docs/#/`

## Project Structure

```
.env
.github/
  workflows/
    deployBackend.yaml
.gitignore
.vscode/
  tasks.json
controllers/
  authController.ts
  profileController.ts
  quoteController.ts
  workoutController.ts
db/
  db.ts
Dockerfile
index.ts
middlewares/
  checkUser.ts
  jwtMiddleware.ts
  uploadFiles.ts
package.json
pre-req.txt
public/
  images/
README.md
routers/
  authRouter.ts
  profileRouter.ts
  quoteRouter.ts
  workoutRouter.ts
tsconfig.json
types/
  Profile.ts
  User.ts
  Workout.ts
utils/
  helpers.ts
```


## Environment Variables

The following environment variables need to be set in the .env file:

- `PORT`
    Port for the backend application to run (e.g., 3000)
- `DB_HOST`
    Hostname or IP address of the database (e.g., localhost or 127.0.0.1)
-  `DB_TYPE`
    Type of database in use (e.g., postgres)
- `DB_NAME`
    Database name to connect to (e.g., fit-frenzy)
- `DB_USER`
    Username used to authenticate to database (e.g., root)
- `DB_PASSWORD`
    Password used to authenticate the user to database (e.g., my_password)
- `DB_PORT`
    Port of the database (e.g., 6543)
- `JWT_SECRET`
    Secret key for signing JSON Web Token to authenticate user (e.g., abcdefghijklmnop123)
- `GCP_SA_KEY`
    Service account key for Google Cloud Platform (e.g., `{"type": "service_account", "project_id": "my-project-id", ...}`)
- `GCP_PROJECT_ID`
    Google Cloud Platform project ID (e.g., `my-gcp-project`)
- `GCP_REGION`
    Google Cloud Platform region where your service should be hosted (e.g., `us-central1`)

## Deployment
The application is deployed using GitHub Actions and Google Cloud Run. The deployment workflow is defined in deployBackend.yaml.

To deploy the application, push changes to the main branch or manually trigger the workflow using the GitHub Actions interface.

Currently it is deployed in https://fit-frenzy-backend-630243095989.europe-west1.run.app

