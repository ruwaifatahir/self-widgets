# exit when any command fails
set -e

# @ugly Take PM2 down since we don't have enough mem (RAM+swap) to compile.
# pm2 stop all || echo "No PM2 processes running!"

# Update code
git pull
git submodule update --init --recursive

# Fix for heap size
export NODE_OPTIONS=--max_old_space_size=4096

# Start of app-web build
cd ../app-web

# Install and build
echo "web: Install NPM dependencies"
npm i

echo "web: Build"
npm run build

# Back to root directory
cd ..

# Start of app-engine build
#cd app-engine

# Install, build, remove and start ecosystem.config.js
#echo "engine: Install NPM dependencies"
#npm i

# Maizzle
#cd maizzle
#npm i
#npm run build
#cd ..

# npm run pm2:restart && echo ""    Not working? So we do:
#echo "engine: Build and migrate"
#npm run build
#npm run migration:run

#echo "Start PM2"
#((pm2 delete all && pm2 flush all) || echo "No processes")
#rm -rf ~/.pm2/logs
#pm2 start ecosystem.config.js
#pm2 save

# Back to root directory
#cd ..

#( flock -w 10 9 || exit 1
#    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock

# TODO High: Review
# Clear Cloudflare cache
#source .env

#curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
#     -H "X-Auth-Email: ${CLOUDFLARE_AUTH_EMAIL}" \
#     -H "X-Auth-Key: ${CLOUDFLARE_AUTH_KEY}" \
#     -H "Content-Type: application/json" \
#     --data '{"purge_everything":true}'
