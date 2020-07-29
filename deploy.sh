rm -rf runtime/htmlSource -rf
rm -rf runtime/static -rf
git clone https://github.com/skrumblenetwork/beep-server.git runtime/htmlSource
cd runtime/htmlSource
npm install
npm run build
cd ../../
cp runtime/htmlSource/dist runtime/static -r