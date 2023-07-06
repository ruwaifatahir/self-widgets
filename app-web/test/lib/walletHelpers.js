const {ethers} = require("ethers");
const axios = require("axios");
const {getEngineUrl, getUnsecureAxiosConfig} = require("./parallel");
const {puppeteerHelpers} = require("./puppeteerHelpers");

// @see also app-engine/test/lib/signerHelpers.ts

// Generated with https://iancoleman.io/bip39/
const name2pk = {
	alice: '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897', // Hardhat account #10
	bob: '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82', // Hardhat account #11
	charlie: '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1', // Hardhat account #12
	devin: '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd', // Hardhat account #13
};

let rpc = 'http://127.0.0.1:' + (8545 + parseInt(process.env.JEST_WORKER_ID));
let provider = new ethers.providers.JsonRpcProvider(rpc);

async function setWallet(name) {

	// Abort due to not exists?
	if (!name2pk[name])
		throw new Error('Invalid name given!');

	// Expose a retriever function.
	await puppeteerHelpers.exposeFunctionEx('_test_libWallet_testWallet', () => {
		return {
			pk: name2pk[name],
		};
	});
}

async function connectWallet() {
	await page.evaluate(async () => await window.TestRegistry.get('lib.Signer2').connectSigner() && await window.TestRegistry.get('lib.AuthManager').ensureSignedIn());
	await puppeteerHelpers.waitForVisible('@layout-topBar-Profile');
}

function getWalletAddress(name) {
	return getWallet(name).address;
}

function getWallet(name) {

	// Abort due to not exists?
	if (!name2pk[name])
		throw new Error('Invalid name given!');

	// Init wallet.
	return new ethers.Wallet(name2pk[name], provider);
}

let contracts = {
	TestPaymentToken: null, //require(process.cwd() + '/../chain-contracts/deployments/localhost/TestPaymentToken.json'),
	TestEcoCreditToken: null, //require(process.cwd() + '/../chain-contracts/deployments/localhost/TestEcoCreditToken.json'),
};

function initContracts() {

	// Init signer.
	let wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'); // Hardhat account #0
	let signer = wallet.connect(provider);

	// Init contracts.
	for (let i in contracts)
		contracts[i] = new ethers.Contract(contracts[i].address, contracts[i].abi, signer);
}

//initContracts();

module.exports = {
	walletHelpers: {
		setWallet,
		getWallet,
		connectWallet,
		getWalletAddress,
		contracts,
	},
};
