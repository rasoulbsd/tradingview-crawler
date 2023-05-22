#!/bin/bash

read -p "Enter email: " email
read -p "Enter password: " pass
read -p "Enter value: " value

npm run tv:set_prop $email $pass $value
