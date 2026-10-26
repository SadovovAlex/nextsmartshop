sudo -u webapp pm2 delete shuvalov-be
sudo -u webapp pm2 start shuvalov-be.js --name shuvalov-be 
sudo -u webapp pm2 show shuvalov-be
sudo -u webapp pm2 logs shuvalov-be --lines 20 --nostream

