unzip release.zip
pm2 delete server
pm2 start ./.next/standalone/server.js
rm ./release.zip
