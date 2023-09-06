import {
  AnkrProvider,
  Blockchain, GetAccountBalanceReply
} from '@ankr.com/ankr.js';
import axios from 'axios';

// would put this in an ENV, but for sake of simplicity leaving in here
const RPC = 'https://rpc.ankr.com/multichain/f84c922a74486348546abd55d4382dd0ec0bb417d16d4a7bce13f66476ea8b18'

// THIS WOULD BE THE EASIEST WAY TO DO THIS
// Setup provider AnkrProvider
const provider = new AnkrProvider(RPC);

// Get token balances of address with USD prices among multiple chains
export const getAccountBalance = async (walletAddress: string, blockchains: Blockchain[]): Promise<GetAccountBalanceReply> => {
  return provider.getAccountBalance({
    blockchain: blockchains,
    walletAddress: walletAddress,
  });
};


// IF YOU WANTED TO USE THE API DIRECTLY INSTEAD
export const getEthPrice = async () => {
  const optionsTokenPrice = {
    method: 'POST',
    url: RPC,
    params: { ankr_getAccountBalance: '' },
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    data: {
      id: 1,
      jsonrpc: '2.0',
      method: 'ankr_getTokenPrice',
      params: {
        blockchain: 'eth',
        contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      }
    }
  };
  return axios.request(optionsTokenPrice);
}




// // THIS WOULD NOT WORK--- YOU CAN'T USE THIS CROSS CHAIN
// // FOR EXAMPLE ON ARBITRUM THE NATIVE TOKEN ON THIS SHOWS AS ARB EVEN THOUGH IT'S TECHNICALLY ETH
// export const getAccountBalance = async (walletAddress: string, blockchains: Blockchain[]): Promise<GetAccountBalanceReply> => {


//   const options = {
//     method: 'POST',
//     url: RPC,
//     params: { ankr_getAccountBalance: '' },
//     headers: { accept: 'application/json', 'content-type': 'application/json' },
//     data: {
//       id: 1,
//       jsonrpc: '2.0',
//       method: 'ankr_getAccountBalance',
//       params: {
//         blockchain: blockchains,
//         skipSyncCheck: true,
//         walletAddress: walletAddress,
//       }
//     }
//   };

//   const response = await axios.request(options)
//   if (response.data.result.assets.length > 0) {
//     await Promise.all(response.data.result.assets.map(async (asset: Balance, index: number) => {
//       const optionsTokenPrice = {
//         method: 'POST',
//         url: RPC,
//         params: { ankr_getAccountBalance: '' },
//         headers: { accept: 'application/json', 'content-type': 'application/json' },
//         data: {
//           id: 1,
//           jsonrpc: '2.0',
//           method: 'ankr_getTokenPrice',
//           params: {
//             blockchain: asset.blockchain,
//             contractAddress: asset.contractAddress
//           }
//         }
//       };
//       
//       // WAS THINKING YOU WANTED ME TO LOOK UP TOKEN PRICES FIGURING THAT IT WASNT IN THE INITIAL API
//       const tokenPrice = await axios.request(optionsTokenPrice);
//       response.data.result.assets[index].priceForToken = tokenPrice.data.result.usdPrice;
//     }));
//   }

//   return response.data.result
// }