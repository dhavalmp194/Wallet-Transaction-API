export const ERC165Abi: any = [
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  
export const ERC1155InterfaceId: string = "0xd9b67a26";
export const ERC721InterfaceId: string = "0x80ac58cd";

export const dexContractAddresses = [
    "0x1111111254eeb25477b68fb85ed929f73a960582",
    "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad"
]

export const nftMarketplaceAddresses = [
    "0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5",  //Blur.io: Marketplace 3
    "0x00000000000000adc04c56bf30ac9d3c0aaf14dc",  //seaport 1.5,
    "0x253553366Da8546fc250f225fe3d25d0c782303b"   //ENS registry
]