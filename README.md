# Candle Backend Application

## Docker Setup

* Download project `git clone https://gitlab.com/akazakou/ads-platform.git`
* Go to the folder with project `cd ads-platform`
* Now you can run project with command `docker-compose up`
* List of available API Endpoints will be acessible by link http://localhost:3000/docs (Default login: admin / password123)

## What implemented: 

* HTTP web server based on HAPI.js
* Database storing with Mongoose.js and MongoDB database
* Swagger documentation description with 
* Offers CRUD operations
* Branches crud operations
* User CRUD operations
* Users authorisation mechanism
* Retailers information CRUD operations
* Files database models (CRUD not implemented)
* Seed functionality with example data by fastfood restraunts
* Plan entity CRUD operations
* Configuration service for working with ARGV, ENV and JSON configuration files
* Docker environment operations for service architecture (App Server, DB Server, Mail Server)
* Logging of main activities on the server

## Standalone Setup

* Dependencies: Node.js >= 6.0 and MongoDB => 3.4
* Download project `git clone https://gitlab.com/akazakou/ads-platform.git`
* Go to the folder with project `cd ads-platform`
* Install npm modules by command `npm install`
* Build the server by command `npm build`
* Update `config.json` file to write credentials for database access
* Start web application with command `npm run start`
* List of available API Endpoints will be acessible by link http://localhost:3000/docs (Default login: admin / password123)

## Configuration `config.json` example

```json
{
  "server": {
    "port": 3000,
    "auth": {
      "jwt": {
        "active": true,
        "jwtSecret": "change me"
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
