const {Socket} = require("net");
const observableProcess = require("observable-process");
const {endChildProcesses} = require("end-child-processes");
const {exec} = require('child_process');
const express = require('express');
const axios = require('axios');
const https = require('https');
const os = require('os');
const fs = require('fs');

// Load configs.
require('dotenv').config({path: '../.env'});

//let engineConfig = require('dotenv').parse(Buffer.from(fs.readFileSync('../app-engine/.env')));

//
let numProcesses = parseInt(process.env.TEST_NUM_PROCESSES || 3);
console.info('Starting ' + numProcesses + ' instance(s)')

function outputWithId(component, logType, num) {

	return data => {
		let result = [];

		for (let line of data.toString().split("\n"))
			result.push(component + ' ' + num + ' :  ' + line);

		console[logType](result.join("\n"));
	};
}

async function startBlockchainNode(port, id) {

	const nodeProcess = observableProcess.start('npx hardhat node --port ' + port, {cwd: __dirname + "/../chain-contracts/"});

	nodeProcess.stdout.on("data", outputWithId('blockchain', 'log', id));
	nodeProcess.stderr.on("data", outputWithId('blockchain', 'error', id));

	await nodeProcess.output.waitForText("WARNING: These accounts, and their private keys, are publicly known.");

	console.info('⚙️ ️ Blockchain "' + id + '" ready on port ' + port);
}

async function startEngineNode(port, index) {

	// Clear dist.
	exec("cd " + __dirname + "/../app-engine && npm run prebuild");

	// Start process.
	const script = process.argv.includes('--withoutWatching') ? 'start' : 'start:dev';

	const engineProcess = observableProcess.start('npm run ' + script, {
		cwd: __dirname + "/../app-engine",
		env: {
			...process.env,
			APP_PORT: port,
			JEST_WORKER_ID: index + 1,
		}
	});

	engineProcess.output.on("data", outputWithId('engine', 'info', index));
	engineProcess.stderr.on("data", outputWithId('engine', 'error', index));

	await engineProcess.output.waitForText("Nest application successfully started");

	//
	engineProcess.waitForEnd().then(result => {
		console.info('Ended engine ' + index, result);
	});

	// Notify
	console.info('⚙️ ️ Engine ' + index + ' ready on port ' + port);
}

function initInputControl() {

	// Listen for text input.
	var stdin = process.openStdin();

	stdin.on('data', async chunk => {

		// Is reset command?
		if (chunk.toString() === 'reset' + "\n")
			await reset();

	});
}

async function reset() {
	console.info('🌈  Resetting...');

	await endChildProcesses();
	await initServices();
}

async function initServices() {

	// Start blockchain node which will not be used and only have deployed data.
	//await startBlockchainNode(8600, 'node fresh');

	//await buildMaizzle();

	//
	await startParallelServices();
}

/*
// TODO High: Auto watch changes and rebuilt? Did not working with `npm run serve` since it does not produce a /dist?
async function buildMaizzle() {

	// Start process.
	const maizzleProcess = observableProcess.start('npm run build', {
		cwd: __dirname + "/../app-engine/maizzle",
		env: {
			...process.env,
		}
	});

	await maizzleProcess.output.waitForText(" templates in");

	// Throw error?
	if (maizzleProcess.stderr.fullText().includes('Failed')) {
		console.info(maizzleProcess.output.fullText());

		throw new Error('Error compiling Maizzle!');
	}
}

async function buildEngine() {
	const engineProcess = observableProcess.start('npm run build', {
		cwd: __dirname + "/../app-engine",
	});

	engineProcess.output.on("data", e => console.info(e));
	engineProcess.stderr.on("data", e => console.error(e));

	await engineProcess.waitForEnd();
}
*/

async function startParallelServices() {

	// Build engine since we won't use watching?
	if (process.argv.includes('--withoutWatching')) {
		await buildEngine();
	}

	// Test for reach process.
	await Promise.all(Array(numProcesses).fill().map(async (dummy, index) => {

		// Init port mapping.
		let ports = {
			blockchain: 8545 + index + 1,
			frontend: 5050 + index + 1,
			engine: 3000 + index + 1,
		};

		// Sometimes we want to run this? Maybe check if the port is in use first?
		// exec(`kill -9 $(lsof -ti:${ports["blockchain"]})`);
		// exec(`kill -9 $(lsof -ti:${ports["frontend"]})`);
		// exec(`kill -9 $(lsof -ti:${ports["engine"]})`);

		// Start blockchain node.
		//await startBlockchainNode(ports.blockchain, 'node test ' + index);

		// Start engine server.
		//await startEngineNode(ports.engine, index);

		// Start vite frontend server.
		const frontendProcess = observableProcess.start('npx vite --force --port ' + ports.frontend, {
			cwd: __dirname + "/../app-web",
			env: {
				...process.env,
				VITE_CACHE_DIR: 'node_modules/.vite/test-process-' + index,
				VITE_WITHOUT_WATCHING: process.argv.includes('--withoutWatching') ? 'true' : 'false',
				IS_PARALLEL: 'true',
				PARALELL_INDEX: index,
			}
		});

		frontendProcess.stdout.on("data", outputWithId('frontend', 'info', index));
		frontendProcess.stderr.on("data", outputWithId('frontend', 'error', index));

		await frontendProcess.output.waitForText("ready in ");

		console.info('⚙️  Vite frontend ' + index + ' ready on port ' + ports.frontend);

	}));

	// Start blockchain nodes for PHPStorm testing of engine.
	await Promise.all(Array(numProcesses).fill().map(async (dummy, index) => {

		// Start blockchain node.
		//await startBlockchainNode(8545 + 1 + numProcesses + index, 'node dev ' + (index));
	}));

	console.info('✅ \x1b[32mServices started! \x1b[0m');
}

(async () => {

	// Abort due to already seems to be running?
	if (!await isPortFree(8545 + 1)) {
		console.error("\r\n" + '👍  \x1b[33m Parallel test services seemed to be already started! Aborting  \x1b[0m' + "\r\n");

		return;
	}

	//
	await initInputControl();
	await initServices();

})();

// @author Unknown
async function isPortFree(port) {
	return new Promise((resolve, reject) => {
		const socket = new Socket();

		const timeout = () => {
			resolve(port);
			socket.destroy();
		};

		const next = () => {
			socket.destroy();
			resolve(false);
		};

		setTimeout(timeout, 200);
		socket.on("timeout", timeout);

		socket.on("connect", function () {
			resolve(false);
		});

		socket.on("error", function (exception) {
			resolve(true);
		});

		socket.connect(port, "0.0.0.0");
	});
}
