pm2 start ./be/shuvalov-be.js
pm2 start ./.next/standalone/server.js
pm2 save
pm2 startup
pm2 list
