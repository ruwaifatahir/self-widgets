# Set current working dir
cd "$(dirname "$0")"

echo $1

if [[ $1 != "--no-install" ]]
then
	#(cd ../chain-contracts && rm -rf node_modules) &
	#(cd ../app-engine && rm -rf node_modules) &
	#(cd ../app-engine/maizzle && rm -rf node_modules) &
	(cd ../app-web && rm -rf node_modules) &
	wait
fi

#(cd ../chain-contracts && npm i --force) &
#(cd ../app-engine && npm i && node node_modules/puppeteer/install.js) &
#(cd ../app-engine/maizzle && npm i) &
(cd ../app-web && npm i) &
wait
