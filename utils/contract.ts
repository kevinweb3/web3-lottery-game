import { ethers } from 'ethers'
import lotteryJson from '../contractInfo/Lottery.json'
import lotteryAddress from '../contractInfo/contractAddress.json'

const abi: any = lotteryJson.abi;
const contractAddress = lotteryAddress.contractAddress;
const PRIVATE_KEY: any = process.env.NEXT_PUBLIC_PRIVATE_KEY;

type Address = string
type Amount = string // amounts are always presented as strings

type ContractDetails = {
  owner: Address
  players: Address[]
  balance: Amount
  isManager: boolean
  hasEntered: boolean
  participants: number
  contractBalance: string
}

// 获取provider
// export const provider = new ethers.AlchemyProvider(
//   // 'sepolia',
//   // process.env.NEXT_PUBLIC_ALCHEMY_Sepolia_API_KEY
// );


// 获取signer
// export const signer = provider.getSigner();

// // 获取wallet
// export const wallet = new ethers.Wallet(
//   PRIVATE_KEY,
//   provider
// );

// // 创建合约实例
// export const lotteryContract = new ethers.Contract(
//   abi,
//   contractAddress,
//   provider
// );

// 获取合约地址
// export function getContractAddress(): Address {
//   return contractAddress;
// }

// // 获取部署合约账户地址
// export async function requestAccounts(): Promise<Address> {
//   return (await signer).getAddress()
// }

// // 获取账户余额
// export async function getBalance(address: Address): Promise<Amount> {
//   return ethers.formatEther(await provider.getBalance(address));
// }

// // 获取合约账户余额
// export async function getContractBalance(): Promise<Amount> {
//   return lotteryContract.balanceOf(contractAddress);
// }

// export async function getContractOwner(): Promise<Address> {
//   return lotteryContract.owner();
// }

// // 
// export async function enterLottery(
//   from: Address,
//   ether: Amount,
// ): Promise<string> {
//   return lotteryContract.send({
//     from,
//     value: ethers.formatEther(ether),
//   })
// }

// export async function getPlayers(from: Address): Promise<Address[]> {
//   if (from) {
//     return lotteryContract.getPlayers();
//   }

//   return []
// }

// export async function numPlayers(from: Address): Promise<number> {
//   const players = await getPlayers(from)
//   return players.length
// }

// export async function pickWinner(from: Address): Promise<void> {
//   if (from) {
//     return lotteryContract.pickWinner()
//   }
// }

declare global {
  interface Window {
    ethereum: {
      request: any
    }
  }
}

export async function requestAccounts(): Promise<Address[]> {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const requestAccounts = await provider.send("eth_requestAccounts", [])
  return requestAccounts;
}

export async function pickWinner(from: Address): Promise<void> {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const lotteryContract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  );
  if (from) {
    return lotteryContract.pickWinner()
  }
}

export async function enterLottery(
  from: Address,
  ether: Amount,
): Promise<string> {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const lotteryContract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  );
  return lotteryContract.send({
    from,
    value: ethers.formatEther(ether),
  })
}

export async function getContractBalance(): Promise<Amount> {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const lotteryContract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  );
  console.log(lotteryContract, 999999);
  const balance: any = await provider.getBalance(contractAddress);
  return balance;
}


export async function getContractDetails(
  address: Address,
): Promise<ContractDetails> {
  // const [balance, players, owner, contractBalance] = await Promise.all([
  //   getBalance(address),
  //   getPlayers(address),
  //   getContractOwner(),
  //   getContractBalance(),
  // ])

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = provider.getSigner();
  const lotteryContract = new ethers.Contract(
    contractAddress,
    abi,
    provider
  );

  const owner: any = lotteryContract.owner();
  const players: any = lotteryContract.getPlayers();
  const balance: any = ethers.formatEther(await provider.getBalance(address));
  const contractBalance: any = await provider.getBalance(contractAddress);

  const participants = players.length
  const hasEntered = players.includes(address)
  const isManager = owner === address

  return {
    owner,
    players,
    balance,
    isManager,
    hasEntered,
    participants,
    contractBalance,
  }
}