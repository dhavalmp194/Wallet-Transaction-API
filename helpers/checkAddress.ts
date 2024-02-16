import { ethers } from 'ethers';

export async function isContractAddress(address: string): Promise<boolean> {
    console.log("%c Line:5 🍯 process.env.EXPLORER_API_KEY", "color:#ea7e5c", process.env.EXPLORER_API_KEY);
    const provider = new ethers.EtherscanProvider("homestead",process.env.EXPLORER_API_KEY);
    if(address == "" || address == undefined || address == null){
        return true;
    }
    const code = await provider.getCode(address);
    return code !== '0x';
}
