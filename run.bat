ECHO OFF
git fetch --all
git reset --hard origin/master
node index.js
PAUSE
