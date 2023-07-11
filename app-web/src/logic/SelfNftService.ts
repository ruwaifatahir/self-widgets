import BlockchainContracts from "@/lib/BlockchainContracts";
import axios from "axios";
import {Contract} from "ethers";

export type SelfNftMetaData = {
	name: string;
	image?: string;
	foreignAddresses?: {
		[key: string]: {
			name: string,
			symbol: string,
			address: string,
		}
	}
};

export default new class SelfNftService
{

	public async getMetaDataByName(name: string): Promise<SelfNftMetaData | undefined>
	{
		// Determine token id.
		//let tokenId = keccak256(toUtf8Bytes(name));
		let tokenId = BigInt('0x6361cced86a3d96fcdfd67d241619dea4b531009e032be92d144f98966f34ad0'); // @debug Has existing metadata.

		// Init contract.
		let contract = await BlockchainContracts.getContract('SelfNft');

		// Abort due to name does not exists?
		if(!await this.tokenIdExists(contract, tokenId))
			return undefined;

		// Load metadata.
		let metaData = await this.loadMetaData(contract, name, tokenId);

		// Init empty metadata due to url not present?
		if(!metaData)
			metaData = {
				name: name,
			};

		//
		return metaData;
	}

	private async tokenIdExists(contract: Contract, tokenId: BigInt): Promise<boolean>
	{
		try {

			// Determine if the token exists. Will throw exception if not.
			await contract.ownerOf(tokenId);

			// Exists
			return true;
		}
		catch(ex)
		{
			// Token does not exists?
			if((ex as Error).message?.includes('ERC721: invalid token ID'))
				return false;

			// Rethrow unknown error?
			else
				throw ex;
		}

	}

	private convertIpfsUrlToWeb2Url(ipfsUrl: string)
	{
		let tokenUrl = new URL(ipfsUrl);

		tokenUrl.protocol = 'https';
		tokenUrl.pathname = 'ipfs/' + tokenUrl.hostname + tokenUrl.pathname;
		tokenUrl.host = 'ipfs.io';

		return tokenUrl.toString();
	}

	private async loadMetaData(contract: Contract, name: string, tokenId: BigInt): Promise<SelfNftMetaData | undefined>
	{
		// Get url to metadata.
		let ipfsUrl = await contract.tokenURI(tokenId);

		// Return without rich metadata due to not exists?
		if(!ipfsUrl)
			return;

		// Load meta data.
		let metaDataResponse = await axios.get(this.convertIpfsUrlToWeb2Url(ipfsUrl));

		// Init object.
		return {
			name,
			image: this.convertIpfsUrlToWeb2Url(metaDataResponse.data.image),
			foreignAddresses: metaDataResponse.data.foreignAddresses,
		};
	}

}
