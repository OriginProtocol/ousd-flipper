import { ethers } from "ethers";
import { writable, derived, get } from "svelte/store";
import { ousd_abi } from "./interfaces/OUSD";
import { flipper_abi } from "./interfaces/Flipper";
import { chainlink_abi } from "./interfaces/Chainlink";

const APY_URL = window.APY_URL || 'http://localhost:8000/api/v1/apr/history'

export const isConnected = writable(false);
export const estTxCost = 90000;
export const maxFlip = 25000;
export const flipperBalances = {
  DAI: writable(undefined),
  OUSD: writable(undefined),
  USDC: writable(undefined),
  USDT: writable(undefined),
};
export const userBalances = {
  DAI: writable(undefined),
  OUSD: writable(undefined),
  USDC: writable(undefined),
  USDT: writable(undefined),
};
export const ousdBalance = userBalances.OUSD;
export const userAllowances = {
  DAI: writable(undefined),
  OUSD: writable(undefined),
  USDC: writable(undefined),
  USDT: writable(undefined),
};
export const gasPrice = writable(undefined);
export const ethPrice = writable(undefined);
export const txGasCost = derived([gasPrice, ethPrice], (data) => {
  if (data[0] == undefined || data[1] == undefined) {
    return undefined;
  }
  return parseInt((estTxCost * data[0] * data[1]) / 1e9);
});
export const apyData = writable(undefined)

let provider;

const ADDRESSES = {
  FLIPPER: "0xcecaD69d7D4Ed6D52eFcFA028aF8732F27e08F70",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
  OUSD: "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86",
  CHAINLINK_ETH_USD: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

const DECIMALS = {
  USDT: 6,
  USDC: 6,
  DAI: 18,
  OUSD: 18,
};

async function updateFlipperBalances() {
  console.log("Updating Flipper Balances");

  for (const stableName of Object.keys(flipperBalances)) {
    const coin = new ethers.Contract(ADDRESSES[stableName], ousd_abi, provider);
    const balanceOf = await coin.balanceOf(ADDRESSES.FLIPPER);
    const usd = ethers.utils.formatUnits(balanceOf, DECIMALS[stableName]);
    flipperBalances[stableName].set(usd);
  }
}

async function updateUserBalances() {
  console.log("Updating Flipper Balances");
  if (window.ethereum.selectedAddress == undefined) {
    return;
  }

  for (const stableName of Object.keys(flipperBalances)) {
    const coin = new ethers.Contract(ADDRESSES[stableName], ousd_abi, provider);
    const balanceOf = await coin.balanceOf(window.ethereum.selectedAddress);
    const usd = ethers.utils.formatUnits(balanceOf, DECIMALS[stableName]);
    userBalances[stableName].set(usd);
  }
}

async function updateAllowances() {
  console.log("Updating Allowances");

  for (const stableName of Object.keys(userAllowances)) {
    if (!get(isConnected)) {
      userAllowances[stableName].set(undefined);
      continue;
    }
    const coin = new ethers.Contract(ADDRESSES[stableName], ousd_abi, provider);
    const user = window.ethereum.selectedAddress;
    const allowance = await coin.allowance(user, ADDRESSES.FLIPPER);
    const usd = ethers.utils.formatUnits(allowance, DECIMALS[stableName]);
    console.log("Allowance", stableName, usd);
    userAllowances[stableName].set(usd);
  }
}

export async function setApproval(stable) {
  const coin = new ethers.Contract(
    ADDRESSES[stable],
    ousd_abi,
    provider.getSigner()
  );
  const desired = ethers.utils.parseEther((10 * 1e10).toString());
  console.log(
    "Creating approval",
    stable,
    ADDRESSES[stable],
    ADDRESSES.FLIPPER,
    desired.toString()
  );
  let tx;
  if (stable == "DAI" || stable == "USDT") {
    tx = await coin.approve(ADDRESSES.FLIPPER, desired.toString(), {
      gasLimit: 40000,
    });
  } else {
    tx = await coin.increaseAllowance(ADDRESSES.FLIPPER, desired.toString(), {
      gasLimit: 40000,
    });
  }
  console.log(tx);
  const receipt = await tx.wait();
  console.log(receipt);
  console.log("--");
  updateAllowances();
  setTimeout(updateAllowances, 3000);
  setTimeout(updateAllowances, 30000);
}

export async function flip(method, amountUsd) {
  const signer = provider.getSigner().connectUnchecked();
  const flipper = new ethers.Contract(ADDRESSES.FLIPPER, flipper_abi, signer);
  const amount = ethers.utils.parseEther(amountUsd.toString());
  const tx = await flipper[method](amount.toString());
  console.log("Submitted");
  const receipt = await tx.wait();
  console.log("Mined");
  console.log(receipt);
  updateFlipperBalances();
  updateUserBalances();
  setTimeout(updateFlipperBalances, 3000);
  setTimeout(updateFlipperBalances, 30000);
  setTimeout(updateUserBalances, 3000);
  setTimeout(updateUserBalances, 30000);
}

export async function connectWallet() {
  if (ethereum === undefined) {
    alert("No wallet active. Install metamask.");
    return;
  }
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setTimeout(() => isConnected.set(true), 250)
  } catch (e) {
    console.error(e);
    isConnected.set(false);
    throw e;
  }
}

export async function checkConnect() {
  if (ethereum === undefined) {
    isConnected.set(false);
    return;
  }
  if (ethereum.selectedAddress == undefined) {
    isConnected.set(false);
    return;
  }
  if (provider === undefined) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  isConnected.set(true);
}

export async function updateGasPrice() {
  const url = "https://www.gasnow.org/api/v3/gas/price?utm_source=ousd_flipper";
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const wei = data.data.standard;
  const gwie = parseInt(wei / 1e9);
  gasPrice.set(gwie);
  console.log("⛽️", gwie);
}

export async function updateApy() {
  const url = APY_URL;
  const response = await fetch(url);
  const data = await response.json();
  apyData.set(data)
  console.log("📈", data);
}

export async function updateEthPrice() {
  if (provider == undefined) {
    return
  }
  const chainlink = new ethers.Contract(
    ADDRESSES.CHAINLINK_ETH_USD,
    chainlink_abi,
    provider
  );
  const answers = await chainlink.latestRoundData();
  const price = answers[1].div((1e8).toString()).toString();
  console.log("💠", price);
  ethPrice.set(parseInt(price));
}

let _WAS_CONNECTED = false;
isConnected.subscribe((hasCon) => {
  if (hasCon && !_WAS_CONNECTED) {
    provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log("After connect update")
    updateFlipperBalances();
    updateUserBalances();
    updateAllowances();
    updateEthPrice()

    setTimeout(() => {
      console.log("Delayed update")
      updateFlipperBalances();
      updateUserBalances();
      updateAllowances();
      updateEthPrice()
    }, 1000)
    _WAS_CONNECTED = true;
  }
});

checkConnect();
updateGasPrice();
updateEthPrice();
updateApy();
