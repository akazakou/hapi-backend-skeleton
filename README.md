# Moon Active company test job

## Requirements
Your task is to write a simple application server that prints a message at a
given time in the future.

The server has only 1 endpoint:

echoAtTime - which receives two  parameters, time and message,
and writes that message to the server console at the given time.


Since we want the server to be able to withstand restarts it will use
redis to persist the messages and the time they should be sent at.


You should also assume that there might be more than one server
running behind a load balancer (load balancing implementation itself
does not need to be provided as part of the answer).

Each message should be printed exactly one time by any server.

In case the server was down when a message should have been 
printed, it should print it out when going back online. 

The focus of the exercise is the efficient use of redis and its data 
types as well as seeing your code in action. 

## Installation

* Clone the git repository by calling `git clone git@gitlab.com:akazakou/moonactive.git`
* Go to the directory where you cloned in project `cd moonactive`
* Run installation of all required packages `npm install`
* Build project `npm run build`
* Change parameters for accessing to resources in `config.json`. All available parameters you can find in `src/config/default.json` file
* Run the server by command `npm run start`
* Automated tests will be available by command `npm run test`

## Workflow
You have one HTTP endpoint for accessing to creation of new tasks, available by link `http://localhost:3000/tasker/add`

Example of calling:
```javascript
var data = JSON.stringify({
  "date": "2017-09-24T12:17:00.137Z",
  "message": "This is a test message"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "http://localhost:3000/tasker/add");
xhr.setRequestHeader("content-type", "application/json");

xhr.send(data);
```

## Description
All developer files placed in `src` directory

* `config` - basic service for manipulating of configuration files
  * `default.json` - contain default configuration for system initialization
  * `index.ts` - using `nconf` package implementation of system configuration
* `log` - logs operating service
  * `index.ts` - using `winston` package implementation of logging system
* `redis` - redis client for using inside of developed system
  * `index.ts` - using `redis` and `bluebird` packages implementation of Redis client in async mode
  * `types.d.ts` - overloading of standard redis package interfaces for using it in async mode
* `server` - basic implementation of HTTP web server
  * `index.ts` - using `hapi` package for HTTP server implementation
* `tasker` - main functionality that was requested
  * `controller.ts` - main functionality that realizing HTTP transport for API Endpoints
  * `index.ts` - main file for initializing tasker functionality
  * `routes.ts` - description routes for HTTP API Endpoints with validation implementing
  * `service.ts` - service for check and run received tasks
  * `types.d.ts` - description of interface for using received tasks
  * `index.ts` - main file for initializing of application