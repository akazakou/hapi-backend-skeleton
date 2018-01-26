# Node.js API Skeleton Application

## Heroku Setup

* Create new application in Heroku dashboard interface
* Connect to the application plugin `mLab MongoDB`
* Go to the `mLab MongoDB` plugin configuration web interface and create new database user
* Go to the setting and assign environment variables:
  * `NODE_ENV=production` - production node.js environment. It will not monitoring src/ folder changes
  * `database__uri` - MongoDB connection URI for accessing to database, provided by `mLab MongoDB` plugin
* Install Heroku app to your local computer
* Go to the sources folder (where placed `.git` subfolder) and add new remotes `heroku git:remote -a app_name`
* Login into Heroku app `heroku login`
* Login into Heroku containers registry `heroku container:login`
* Add new remotes to git configuration `heroku git:remote -a app_name`
* Push new version of web application container `heroku container:push web:0.0.1`

## Docker-Compose Setup for local development

* Download project `git clone https://gitlab.com/akazakou/backend.git`
* Go to the folder with project `cd backend`
* Now you can run project with command `docker-compose up`
* List of available API Endpoints will be accessible by link http://localhost:3000/docs (Default login: admin / password123)

## Standalone Setup

* Dependencies: Node.js >= 6.0 and MongoDB => 3.4
* Download project `git clone https://gitlab.com/akazakou/ads-platform.git`
* Go to the folder with project `cd ads-platform`
* Install npm modules by command `npm install`
* Update `config.json` file to write credentials for database access
* Start web application with command `npm start`
* List of available API Endpoints will be accessible by link http://localhost:3000/docs (Default login: admin / password123)

## What implemented: 

* HTTP web server based on HAPI.js
* Database storing with Mongoose.js and MongoDB database
* Swagger documentation description with 
* User CRUD operations
* Users authorisation mechanism
* Access control mechanism for Admin, User and unknown auth type users
* Files database models (CRUD not implemented)
* Configuration service for working with ARGV, ENV and JSON configuration files
* Docker environment operations for service architecture (App Server, DB Server, Mail Server)
* Logging of main activities on the server

## Configuration `config.json` example

```json
{
  "server": {
    "port": 3000,
    "auth": {
      "jwt": {
        "active": true,
        "privateKey": "change me"
      }
    },
    "plugins": [
      "jwt-auth",
      "swagger",
      "logger",
      "roles"
    ]
  },
  "database": {
    "uri": "mongodb://localhost:27017/candle-backend",
    "options": {
      "useMongoClient": true,
      "autoIndex": true,
      "reconnectInterval": 500,
      "poolSize": 10,
      "bufferMaxEntries": 0
    }
  },
  "log": {
    "level": "debug",
    "json": false,
    "showLevel": true,
    "timestamp": true,
    "colorize": true,
    "exitOnError": false,
    "handleExceptions": true,
    "humanReadableUnhandledException": true
  }
}
```

## Documentation

After server stated, documentation for available API Endpoints will be available by link: http://host:port

## NPM Scripts

* `npm start` - build and start `production` version of API Endpoint application
* `npm run debug` - build and start `development` version of API Endpoint application with files changes monitoring and debugger on port 9229
* `npm build` - compile all TypeScript files into JavaScript
* `npm test` - build and run test coverage functionality. `nyc` configuration for test report available in `nyc` section of `package.json` file
* `npm run coverage` - run test coverage functionality
* `npm run codecov` - upload test coverage reports onto codecov service. Require environment variable `CODECOV_TOKEN`
* `npm run migrate:up` - implement database update scripts to project database. Require environment variable `database__uri`

## Migrations

This functionality provided by [migrate-mongoose](https://www.npmjs.com/package/migrate-mongoose) package and will be executed every time on container startup

`migrate up --es6 --autosync --dbConnectionUri mongodb://localhost:27017/backend-database`

## Initial database dump

For local development, you can use database dump, received with `mongodump` support. For automatic uploading this dump into database container, you should pace all files into `docker/database/dump` folder
