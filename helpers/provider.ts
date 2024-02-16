import { ethers } from 'ethers';

// Declare Ethereum provider
const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

export default provider;