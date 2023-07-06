#!/bin/bash
set -e

# Set current working dir
cd "$(dirname "$0")"

# Kill spawned process on exit. Like the blockchain node.
cleanup() {
    # kill all processes whose parent is this process
    pkill -P $$
}

for sig in INT QUIT HUP TERM; do
  trap "
    cleanup
    trap - $sig EXIT
    kill -s $sig "'"$$"' "$sig"
done
trap cleanup EXIT

# Install (NPM dependencies) first?
if [[ $1 != "--no-install" && $1 != "--install" ]]
then

  read -p "Run install.sh first? [y/Y] " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    ./install.sh
  fi

fi

if [[ $1 = "--install" ]]
then
    ./install.sh
fi

# Start blockchain node?
#if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
#  echo "Chain node detected"
#else
#
#    cd ../chain-contracts
#    npx hardhat node &
#    while ! echo exit | nc localhost 8545; do sleep 1; done
#    cd ../scripts
#
#fi

# Now we test.
#cd ../chain-contracts
#npm run test
cd ..

#printf "\n\n==========================================\n✅ End chain-contracts/ testing\n==========================================\n\n"

printf "\n\n==========================================\n✅ app-engine/ + app-web/ services started \n==========================================\n\n"

cd app-engine
npm run test
cd ..

printf "\n\n==========================================\n✅ End app-engine/ testing\n==========================================\n\n"

cd app-web

# We check TS and if every import can be resolved.
npm run typecheck
npm run build

# We test - we do not depend on above `typecheck` and `build` commands.
npm run test
cd ..

printf "\n\n==========================================\n✅ End app-web/ testing\n==========================================\n\n"

echo "✅ Testing done!"
