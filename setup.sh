#!/bin/bash

#install db

echo "MYSQL DATABASE MIGRATION (password required)"

sudo mysql -u root -p < db_indeed_bot.sql 

#install modules

npm install
npm update

