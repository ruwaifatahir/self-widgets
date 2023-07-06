import {ethers} from "ethers";
import Testing from "@/lib/Testing";

import ErrorEx from "@/lib/ErrorEx";

const contracts = import.meta.glob('./../../../chain-contracts/deployments/**/*.json');

// TODO Medium: Split to Wallet and Blockchain classes.
export default new class Wallet {

	public rpcProvider?: ethers.JsonRpcProvider;

	constructor() {
		this.initRpcProvider();
	}

	public async init(): Promise<void> {
	}


	// TODO High: Also implement for production with a non-public RPC?
	protected initRpcProvider() {

		// Get RPC url from config.
		let rpcUrl = Testing.transformPortForJestTesting(import.meta.env.VITE_CHAIN_RPC);

		// Init JSON provider.
		this.rpcProvider = new ethers.JsonRpcProvider(rpcUrl, {
			name: 'unknown',
			chainId: +import.meta.env.VITE_CHAIN_ID,
		});
	}

	private async getContractDeployment(name: string): Promise<{ address: string, abi: any }> {
		return await contracts['../../../chain-contracts/deployments/' + import.meta.env.VITE_CHAIN_DIR + '/' + name + '.json']() as any;
	}

	async getContract(name: string) {

		// Get deployment.
		let deployment = await this.getContractDeployment(name);

		// Get contract.
		return this.getContractByAddress(deployment, deployment.address);
	}

	async getErc20Contract(address: string) {

		// Get deployment.
		let deployment = await this.getContractDeployment('USDT');

		// Get contract.
		return this.getContractByAddress(deployment, address);
	}

	private async getContractByAddress(deployment: { address: string, abi: any }, address: string) {
		return new ethers.Contract(deployment.address, deployment.abi, this.rpcProvider);
	}

	private async findContractByAddress(address: string) {

		// Loop each contract.
		for (let contractFn of Object.values(contracts)) {
			let contractData: any = await contractFn();

			if (contractData.address == address) {
				return contractData;
			}
		}

		// Error
		throw new ErrorEx('Contract not found!', {address});
	}

	public async getTransactionEvents(transaction: any, eventName: string) {

		// Get interface.
		let contractData = await this.findContractByAddress(transaction.to);

		let iface = new ethers.Interface(contractData.abi);

		// Filter on event name.
		return transaction.logs
			.map((log: any) => {
				try {
					return iface.parseLog(log);
				} catch (ex) {
					return null;
				}
			})
			.filter((parsedLog: any) => parsedLog && parsedLog.name === eventName);
	}

	public async getTransactionEvent(transaction: any, eventName: string) {

		// Filter events.
		let events = await this.getTransactionEvents(transaction, eventName);

		// Error due to multiple found?
		if (events.length >= 2)
			throw new ErrorEx('Multiple found!', {
				transaction,
				eventName,
			});

		// Return (possible) first.
		return events?.[0];
	}

}
