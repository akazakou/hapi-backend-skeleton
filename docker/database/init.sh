#!/bin/bash

# if container already initialized, just skip next operations
if [ -s ${HOME}/docker_init_success ]; then
    echo "Initialization: Container already initialized"
else
    echo "Initialization: apply database example dump "

    mongod --fork --logpath /var/log/mongodb.log
    mongorestore --db "${database__name}" /usr/src/container/dump
    mongod --shutdown

    # create flag that tell this container already was initialized
    echo "true" > ${HOME}/docker_init_success
fi

mongod
