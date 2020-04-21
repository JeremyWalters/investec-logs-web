# investec-logs-web

## Initial setup, build tools and dependencies

### 1. Clone this repo

Clone or download this repo. 

### 2. Create an app in your Firebase console

Before continuing make sure you already have a firebase + firestore setup up and running. If you haven't please get a setup up and running. Example to get up and running - [Investec Firebase/Firestore Functions App](https://github.com/JeremyWalters/investec-logs-functions)

---

Create a Firebase App on the [Firebase Console](https://console.firebase.google.com) under project settings. 
  1) You will be prompt to choose a platform. Choose web
  2) Tick box also setup firebase hosting
  3) Click on dropdown. Choose `Create a new site`
  4) Skip through steps until you reach step 4) of creating a new site. Copy `site` value
  5) In your project paste it your firebase.json file
  6) Skip to finish
  7) Under your created web application **copy** config found under the `Firebase SDK Setup`


### 3. Create config ENV

In your project root create a new file called `.env.local` . Paste copied config in there. Structure data so it look like `.env`. Env file should contain quotations or commas

`.env` example:

```
value1=string
value2=string
```

We are adding the `.local` so the file won't be pushed to github.

## Run app locally

Install dependencies, in project root run `npm install` 
Serve app with `npm run serve`

## Deploy the app to prod

1) Login to firebase

```bash
firebase login
```

2) Link project to firebase project

```bash
firebase use --add
```

3) Make sure in `firebase.json > hosting.site` matches the correct site name which can be found on the Hosting tab.
4) Make sure dependencies in installed
```bash
npm install
```

5) Build app
```bash
npm run build
```

5) Deploy App

```bash
firebase deploy
```

## Project Commands
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
