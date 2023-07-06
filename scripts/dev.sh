# Set current working dir
cd "$(dirname "$0")"

# Install?
if [[ $1 != "--no-install" && $1 != "--install" ]]
then
	./install.sh
fi

# Blockchain
#osascript -e 'tell application "Terminal" to activate' \
#-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
#-e "tell application \"Terminal\" to do script \"cd $PWD \" in window 1" \
#-e 'tell application "Terminal" to do script "cd ../chain-contracts && npx hardhat node" in first tab of the front window'

# @ugly Since there was no way to be really sure it was ready
#sleep 5

# Engine
#osascript -e 'tell application "Terminal" to activate' \
#-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
#-e "tell application \"Terminal\" to do script \"cd $PWD \" in window 1" \
#-e 'tell application "Terminal" to do script "cd ../app-engine && cd maizzle && npm run build && cd .. && npm run dev:seed && npm run start:debug --noMigrations" in first tab of the front window'

# Web
osascript -e 'tell application "Terminal" to activate' \
-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
-e "tell application \"Terminal\" to do script \"cd $PWD \" in window 1" \
-e 'tell application "Terminal" to do script "cd ../app-web && npm run dev" in first tab of the front window'
