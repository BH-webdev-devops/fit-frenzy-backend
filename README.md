# FitFrenzy Backend

**FitFrenzy is a backend application designed to manage user authentication, profiles, quotes, and workouts. This application is built with TypeScript and Node.js, and it uses Docker for containerization and Google Cloud Run for deployment.**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

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
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_PORT`
- `GCP_SA_KEY`
- `GCP_PROJECT_ID`

## Deployment
The application is deployed using GitHub Actions and Google Cloud Run. The deployment workflow is defined in deployBackend.yaml.

To deploy the application, push changes to the main branch or manually trigger the workflow using the GitHub Actions interface.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Tech Stack

- Framework: Node.js with Express
- Database: Supabase (Postgres)
- Containerization: Docker
- Deployment: Google Cloud Run
- Authentication: JSON Web Tokens (JWT)
- File Uploads: Multer
- Environment Variables Management: dotenv

## Key features

- User authentication
    - Sign Up: Allows users to create a new account.
    - Login: Enables users to access their account.
        - forgot password: Provides a way to reset the password if forgotten.
- Profile management
    - Users can add or update their personal information.
- Workout logging
    - Users can log, modify, view and remove their workouts.
    - Users can filter workouts based on various Date Ranges