import express, { Request, Response } from 'express';
import axios from 'axios';
import {ethers} from 'ethers';
import {isContractAddress} from '../helpers/checkAddress';
import {ERC165Abi, ERC1155InterfaceId, ERC721InterfaceId, dexContractAddresses, nftMarketplaceAddresses} from '../helpers/utils';
import provider  from '../helpers/provider';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const {wallet, page, tag} = req.query ;

    if (!wallet) {
      return res.status(500).json({ message: 'Please enter walletAddress' });
    }

    let walletaddress : string = String(wallet).toLowerCase()
    let result: Array<any> = [];
    let txTag = 'OTHER';

    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=${page}&offset=10&sort=asc&apikey=${process.env.EXPLORER_API_KEY}`);
    
    if(response.data.result.length == 0){
        res.status(500).json({success: false, message: "No transaction found"});
    }

    // Extract data from the response
    for (const iterator of response.data.result) {
        //Check transaction type
        let type = String(iterator.from).toLowerCase() === walletaddress ? "outgoing" : "incoming"; 

        //Check is interacted address is contract or not
        let isContract = await isContractAddress(type === "incoming" ? iterator.from : iterator.to)

        if (isContract){

            //Check if interacted address is available in our hardcoded address
            if(dexContractAddresses.includes(type === "incoming" ? iterator.from : iterator.to)){
                txTag = "DeFi";
            }else if(nftMarketplaceAddresses.includes(type === "incoming" ? iterator.from : iterator.to)){
                txTag = "NFT"
            }

            //Initialize contract
            let contractAddress = walletaddress === iterator.from ? iterator.to : iterator.from;

            let contract = new ethers.Contract(String(contractAddress), ERC165Abi, provider);

            try{
                //Check if contract is ERC1155
                let isSFT = await contract.supportsInterface(ERC1155InterfaceId);
                if(isSFT){
                    txTag = "NFT"
                }
            }catch(error){
                console.error("%c Line:42 🍪 error", "color:#3f7cff", error);
            }

            try{
                //Check if contract is ERC
                let isNFT = await contract.supportsInterface(ERC721InterfaceId)
                if(isNFT){
                    txTag = "NFT"
                }
            }catch(error){
                console.error("%c Line:55 🍓 error", "color:#ffdd4d", error);
            }
        }

        //Calculate gas fee
        let gasFee = (parseFloat(ethers.formatUnits(iterator.gasPrice, 9))) * (iterator.gas)

        //Filter tag query
        if(tag == txTag){
            console.log("%c Line:65 🍪", "color:#ed9ec7");
            result.push({
                "txHash": iterator.hash,
                "type": type,
                "tag": txTag,
                "value": ethers.formatEther(iterator.value),
                "fee": ethers.formatUnits(parseInt(String(gasFee)), 9),
                "link": `https://etherscan.io/tx/${iterator.hash}`
            })        
        }else if(!tag){
            console.log("%c Line:77 🍻", "color:#42b983");
            result.push({
                "txHash": iterator.hash,
                "type": type,
                "tag": txTag,
                "value": ethers.formatEther(iterator.value),
                "fee": ethers.formatUnits(parseInt(String(gasFee)), 9),
                "link": `https://etherscan.io/tx/${iterator.hash}`
            })  
        }
    }
    if(result.length === 0){
        res.status(500).json({success: false, message: "No transaction found"});
    }else{
        res.status(200).json({success: true, transactions: result})
    }
} catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({success: false, message: "Error while fetching transaction"});
  }
});

export default router;
