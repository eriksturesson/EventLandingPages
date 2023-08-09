#!/bin/bash

firebase emulators:start --import=./config-emulators/test-database &
firebase_pid=$!
react-scripts start &
tsc --project config-emulators/tsconfig.json &&
sleep 20s &&
node config-emulators/js/config-emulators/createUser.js &&
wait $firebase_pid