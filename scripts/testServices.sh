# Set current working dir
cd "$(dirname "$0")"

# Install (NPM dependencies) first?
if [[ $1 != "--no-install" && $1 != "--install" ]]
then
./install.sh
fi

# Start parallel test services.
node startParallelTestServices.js
