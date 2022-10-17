Project for the course 5G00EV16-3001 By Jani Myllymaa

Description:
This project is basically extended version of teachers camping sites app where you can create two kinds of users
quests and admins. As a quest you can add things into todolist and modify / delete them after beign added. As a quest
you can also change password and name / delete account. When creating an admin user they dont have todolist, admins do only
have view to all users (which is blank for quest users) where they can delete any quest user or other admin users. Admin can also change username and password / delete
own account.


Running project locally

install dependencies on folders client and server by running command npm install

run docker compose up on the root directory

go to folder server/scripts and run node drop-db.js and then node create-db.js and finally node init-db.js

open couple cmdlines with one having the docker running(by the earlier command docker compose up)

on second cmdline window navigate to server folder and run command npm run dev

on third cmdline window navigate to client folder and run command npm start

Running tests

go to client folder and run command npm run test:coverage and you can view results in folder client/coverage/lcov-report/index.html

go to server folder and run command npm run test:coverage and you can view results in folder server/coverage/lcov-report/index.html


link to production server on TAMK: http://172.16.4.209/

Release 1

-added functions for password change and name change
-added function for deleting accounts

Release 2

-added feature forcelogout after quest user deletes own account
-added production version to tamk gitlab virtual machine

known issues

after adding the environmental variables to the code my server side tests didnt work as earlier without environmental variables

test coverages

client: 44.21% statements, 42,1% branches, 42,35% functions and 45,2% lines

server: 34,24% statements, 12,5% branches, 38,7% functions and 34,24% lines (earlier without env variables they were 84,37% statements, 62,5% branches, 90,32% functions and 84,37% lines)
