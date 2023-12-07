let WALLET_CONNECTED = "";
let WALLET_CONNECTION_PREF_KEY = "WC_PREF";
let FromAddress = localStorage.getItem("account").trim(); // Updated On 21 Nov

const toWei = (value) => ethers.utils.parseEther(value.toString());
const convert_toEth = (value) => ethers.utils.formatEther(value);
const toEth = (value) => {
  let valueEth = ethers.utils.formatEther(value);
  return Math.floor(valueEth * 100) / 100;
};

// Function That Convert UnixTimeStamp to Data
const toDate = (value) => {
  const unixTimestamp = value;
  const milliseconds = value * 1000;
  const dateObject = new Date(milliseconds);
  const options = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  };
  const humanDateFormat = dateObject.toLocaleString("en-US", options);
  return humanDateFormat;
};

function remove0xPrefix(account) {
  if (account.startsWith("0x")) {
    return account.substring(2);
  }
  return account;
}

// Updated On 20 Nov
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_startTime",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "_endTime",
        type: "uint64",
      },
      {
        internalType: "uint8",
        name: "_bonusPercentage",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newTime",
        type: "uint256",
      },
    ],
    name: "ChangeEndTime",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
    ],
    name: "ClaimBonusToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "ClaimToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updateTime",
        type: "uint256",
      },
    ],
    name: "PriceUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdtSent",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "UpdateBalance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "newPercentage",
        type: "uint8",
      },
    ],
    name: "UpdateBonusPercentage",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPricePerToken",
        type: "uint256",
      },
    ],
    name: "UpdatePricePerToken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "bonusAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bonusPercentage",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_endTime",
        type: "uint64",
      },
    ],
    name: "changeEndTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "claimAmount",
        type: "uint256",
      },
    ],
    name: "claimBonusToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "claimAmount",
        type: "uint256",
      },
    ],
    name: "claimToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "contributers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endTime",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getIcoStage",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pricePerToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenSold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_sentUsdt",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address",
        name: "_refAddress",
        type: "address",
      },
    ],
    name: "updateBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_newPercentaeg",
        type: "uint8",
      },
    ],
    name: "updateBonusPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newPrice",
        type: "uint256",
      },
    ],
    name: "updatePricePerToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Cnfc_ABi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_toAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ico",
        type: "address",
      },
    ],
    name: "transferToIco",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Usdt_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Updated On 20 Nov
const Contract_List = {
  ico_address: "0x83295ed7424bDaa19F11969FC403D7aF1cB80292",
  cnfc_Contract_Address: "0x88e8B1756FF261A7d6C3Ac3364D0bE0fb75F761f",
  usdt_address: "0x3Bb0f16c334279E12548F8805a1674124fE4FC40",
};

const CHAIN_ID_REQUIRED = 11155111; //Sepolia
const CHAIN_CONNECTED = {
  id: null,
  name: null,
};

/**
 * All blockchain explorers
 */
const BLOCKCHAIN_EXPLORERS = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  137: "https://polygonscan.com",
  1402: "https://explorer.public.zkevm-test.net",
  80001: "https://mumbai.polygonscan.com",
  11155111: "https://sepolia.etherscan.io",
};

// Metamask connect Function
const connect = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    WALLET_CONNECTED = accounts[0];
    localStorage.setItem("account", WALLET_CONNECTED);
    localStorage.setItem(WALLET_CONNECTION_PREF_KEY, true);
    CHAIN_CONNECTED.id = CHAIN_ID_REQUIRED;
    document.getElementById("connectBtn").innerHTML = "connected";
  } catch (error) {
    console.log({ error });
  }
};
// Metamask disconnect Function

// Updated on 21 nov
const disconnect = () => {
  WALLET_CONNECTED = false;
  // Remove wallet connection preference
  localStorage.setItem("account", null);
  localStorage.setItem(WALLET_CONNECTION_PREF_KEY, WALLET_CONNECTED);
  CHAIN_CONNECTED.name = null;
  CHAIN_CONNECTED.id = null;
  document.getElementById("connectBtn").innerHTML = "Connect Metamask";
};

const onAccountsChanged = async (accounts) => {
  if (accounts.length === 0) {
    console.log("chain changed");
  } else {
    WALLET_CONNECTED = accounts?.[0];
    const chainId = await ethereum.request({ method: "eth_chainId" });
  }
};

//   Contract interaction eth_call reading token balance from tokenAddress

// Claimble amount of token to be claimed
const tokenBalance = async () => {
  // Setup Interface + Encode Function
  const tk_bal = CONTRACT_ABI.find((i) => i.name === "contributers");
  const interfaces = new ethers.utils.Interface([tk_bal]);
  const encodedFunction = interfaces.encodeFunctionData(`${tk_bal.name}`, [
    FromAddress,
  ]);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const token_balance = ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      result
    );
    let tokenBalElement = document.getElementById("claimleToken");

    tokenBalElement.innerHTML = toEth(token_balance[0].toString());
  } catch (error) {
    console.log({ error });
  }
};

const getClaimBonusTokenBalance = async () => {
  // Setup Interface + Encode Function
  const bonus_bal = CONTRACT_ABI.find((i) => i.name === "bonusAmounts");
  const interfaces = new ethers.utils.Interface([bonus_bal]);
  const encodedFunction = interfaces.encodeFunctionData(`${bonus_bal.name}`, [
    FromAddress,
  ]);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const Bonus_token_balance = ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      result
    );
    let bonusTokenBalElement = document.getElementById("bonusAmounts");
    bonusTokenBalElement.innerHTML = toEth(Bonus_token_balance[0].toString());
  } catch (error) {
    console.log({ error });
  }
};

const getTotalTokenSold = async () => {
  // Setup Interface + Encode Function
  const total_TokenSold = CONTRACT_ABI.find((i) => i.name === "totalTokenSold");
  const interfaces = new ethers.utils.Interface([total_TokenSold]);
  const encodedFunction = interfaces.encodeFunctionData(total_TokenSold.name);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const sold_token = ethers.utils.defaultAbiCoder.decode(["uint256"], result);
    let totalTokenSoldElement = document.getElementById("totalTokenSold");

    totalTokenSoldElement.innerHTML = toEth(sold_token[0].toString());
  } catch (error) {
    console.log({ error });
  }
};

// Fetches Token BalanceOf
const Balance_Of_Token = async () => {
  // Setup Interface + Encode Function
  const balanceOf = Cnfc_ABi.find((i) => i.name === "balanceOf");
  const interfaces = new ethers.utils.Interface([balanceOf]);
  const encodedFunction = interfaces.encodeFunctionData(`${balanceOf.name}`, [
    FromAddress,
  ]);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.cnfc_Contract_Address,
          data: encodedFunction,
        },
      ],
    });
    const token_holder_balance = ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      result
    );
    let tokenBalElement = document.getElementById("tokenBal");

    tokenBalElement.innerHTML = toEth(token_holder_balance[0].toString());
  } catch (error) {
    console.log({ error });
  }
};

const toUnixTimestamp = (humanDate) => {
  const dateObject = new Date(humanDate);

  if (isNaN(dateObject)) {
    // Handle invalid date input here
    return null;
  }

  // Get the Unix timestamp in seconds by dividing by 1000 to remove milliseconds
  const unixTimestamp = dateObject.getTime() / 1000;
  return unixTimestamp;
};

//

// Only Contract Owner can Update Endtime
const updateEndTime = async () => {
  let end_time = document.getElementById("endTimeEle");
  let parseEndTime = toUnixTimestamp(end_time.value);

  // Setup Interface + Encode Function
  const change_EndTime = CONTRACT_ABI.find((i) => i.name === "changeEndTime");
  const interfaces = new ethers.utils.Interface([change_EndTime]);
  const encodedFunction = interfaces.encodeFunctionData(
    `${change_EndTime.name}`,
    [parseEndTime]
  );

  let getGas = await getEstimateGas(
    FromAddress,
    Contract_List.ico_address,
    encodedFunction
  );
  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: FromAddress,
          to: Contract_List.ico_address,
          data: encodedFunction,
          gas: getGas.toString(),
        },
      ],
    });
    await waitForTransactionConfirmation(result);
    console.log(result);
  } catch (error) {
    console.log({ error });
  }
};
// Only Contract Owner can Update Endtime

const updateRewardPercentage = async () => {
  let rewardPer = document.getElementById("rewardPer");
  let parseReward = rewardPer.value;
  // Setup Interface + Encode Function
  const change_rewardPer = CONTRACT_ABI.find(
    (i) => i.name === "updateBonusPercentage"
  );
  const interfaces = new ethers.utils.Interface([change_rewardPer]);
  const encodedFunction = interfaces.encodeFunctionData(
    `${change_rewardPer.name}`,
    [parseReward]
  );

  let getGas = await getEstimateGas(
    FromAddress,
    Contract_List.ico_address,
    encodedFunction
  );
  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: FromAddress,
          to: Contract_List.ico_address,
          data: encodedFunction,
          gas: getGas.toString(),
        },
      ],
    });
    await waitForTransactionConfirmation(result);
    console.log(result);
  } catch (error) {
    console.log({ error });
  }
};

const totalSupply = async () => {
  // Setup Interface + Encode Function
  const totalSupply = Cnfc_ABi.find((i) => i.name === "totalSupply");
  const interfaces = new ethers.utils.Interface([totalSupply]);
  const encodedFunction = interfaces.encodeFunctionData(`${totalSupply.name}`);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.cnfc_Contract_Address,
          data: encodedFunction,
        },
      ],
    });
    const total_supply = ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      result
    );
    let total_supply_Element = document.getElementById("total_supply");
    total_supply_Element.innerHTML = toEth(total_supply[0].toString());
  } catch (error) {
    console.log({ error });
  }
};
const get_priceToken = async () => {
  // Setup Interface + Encode Function
  const pricePerToken = CONTRACT_ABI.find((i) => i.name === "pricePerToken");
  const interfaces = new ethers.utils.Interface([pricePerToken]);
  const encodedFunction = interfaces.encodeFunctionData(
    `${pricePerToken.name}`
  );

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const getPriceToken = ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      result
    );
    let getPrice = document.getElementById("pricePerToken");
    getPrice.innerHTML = getPriceToken[0].toString() / 10 ** 6;
  } catch (error) {
    console.log({ error });
  }
};
const getStartTime = async () => {
  // Setup Interface + Encode Function
  const start = CONTRACT_ABI.find((i) => i.name === "startTime");
  const interfaces = new ethers.utils.Interface([start]);
  const encodedFunction = interfaces.encodeFunctionData(`${start.name}`);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const time = ethers.utils.defaultAbiCoder.decode(["uint256"], result);
    let getTime = document.getElementById("startTime");
    getTime.innerHTML = toDate(time[0].toString());
  } catch (error) {
    console.log({ error });
  }
};
const getEndtTime = async () => {
  // Setup Interface + Encode Function
  const end = CONTRACT_ABI.find((i) => i.name === "endTime");
  const interfaces = new ethers.utils.Interface([end]);
  const encodedFunction = interfaces.encodeFunctionData(`${end.name}`);

  try {
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: Contract_List.ico_address,
          data: encodedFunction,
        },
      ],
    });
    const End_time = ethers.utils.defaultAbiCoder.decode(["uint256"], result);
    let getEndTime = document.getElementById("endTime");
    getEndTime.innerHTML = toDate(End_time[0].toString());
  } catch (error) {
    console.log({ error });
  }
};

// Function to wait for transaction confirmation
async function waitForTransactionConfirmation(transactionHash) {
  return new Promise((resolve, reject) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider.once(transactionHash, (transaction) => {
      resolve(transaction);
    });

    provider.once("error", (error) => {
      reject(error);
    });
  });
}

// Contract Write function
const transferMetamask = async () => {
  let codereferral = document.getElementById("codereferral").value; //here place codereferral from database
  document.getElementById("transferBtn").innerHTML = "Transfer.....";
  let referredBY = await remove0xPrefix(codereferral);

  let _to = document.getElementById("toAddr").value;
  const amount_inputElement = document.getElementById("valueTransfer");
  let amount = amount_inputElement.value * 10 ** 6;

  const transfer_coin = Usdt_ABI.find((i) => i.name === "transfer");
  const interfaces = new ethers.utils.Interface([transfer_coin]);
  let encodedFunction = interfaces.encodeFunctionData(`${transfer_coin.name}`, [
    _to,
    amount,
  ]);

  encodedFunction += referredBY; //Sending referredBY address

  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: WALLET_CONNECTED,
          to: Contract_List.usdt_address,
          data: encodedFunction,
        },
      ],
    });

    await waitForTransactionConfirmation(result);
    console.log(result);

    document.getElementById("transferBtn").innerHTML = "Transfer";
  } catch (error) {
    document.getElementById("transferBtn").innerHTML = "Transfer";
    console.log({ error });
  }
};
//

const mintTokens = async () => {
  let mintAmount = document.getElementById("mintAmount").value;
  document.getElementById("mintBtn").innerHTML = "Minting.....";

  let amount = toWei(mintAmount);

  const mint_coin = Usdt_ABI.find((i) => i.name === "mint");
  const interfaces = new ethers.utils.Interface([mint_coin]);
  let encodedFunction = interfaces.encodeFunctionData(`${mint_coin.name}`, [
    Contract_List.ico_address,
    amount,
  ]);

  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: WALLET_CONNECTED,
          to: Contract_List.cnfc_Contract_Address,
          data: encodedFunction,
        },
      ],
    });

    await waitForTransactionConfirmation(result);
    console.log(result);

    document.getElementById("mintBtn").innerHTML = "Mint";
  } catch (error) {
    document.getElementById("mintBtn").innerHTML = "Mint";
    console.log({ error });
  }
};

const getEstimateGas = async (_from, _to, _data) => {
  let gas = await window.ethereum.request({
    method: "eth_estimateGas",
    params: [
      {
        from: _from,
        to: _to,
        data: _data,
      },
    ],
  });
  let parsedGas = parseInt(gas);
  return parsedGas;
};

const Claim_Balance = async () => {
  const claimAmount = document.getElementById("claimAmount").value;
  const parseAmount = toWei(claimAmount);
  // Setup Interface + Encode Function
  const claim_Bal = CONTRACT_ABI.find((i) => i.name === "claimToken");
  const interfaces = new ethers.utils.Interface([claim_Bal]);
  const encodedFunction = interfaces.encodeFunctionData(`${claim_Bal.name}`, [
    FromAddress,
    parseAmount,
  ]);
  const gasToSend = await getEstimateGas(
    WALLET_CONNECTED,
    Contract_List.ico_address,
    encodedFunction
  );

  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: FromAddress,
          to: Contract_List.ico_address,
          data: encodedFunction,
          gas: gasToSend.toString(),
        },
      ],
    });
    console.log(result);
    await waitForTransactionConfirmation(result);
    console.log(`${BLOCKCHAIN_EXPLORERS[11155111]}/tx/${result}`);
  } catch (error) {
    console.log({ error });
  }
};

const claimBonusToken = async () => {
  const claimAmount = document.getElementById("bonusClaimAmount").value;
  const parseAmount = toWei(claimAmount);
  // Setup Interface + Encode Function
  const bonus_claim_Bal = CONTRACT_ABI.find(
    (i) => i.name === "claimBonusToken"
  );
  const interfaces = new ethers.utils.Interface([bonus_claim_Bal]);
  const encodedFunction = interfaces.encodeFunctionData(
    `${bonus_claim_Bal.name}`,
    [FromAddress, parseAmount]
  );
  const gasToSend = await getEstimateGas(
    WALLET_CONNECTED,
    Contract_List.ico_address,
    encodedFunction
  );

  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: FromAddress,
          to: Contract_List.ico_address,
          data: encodedFunction,
          gas: gasToSend.toString(),
        },
      ],
    });
    await waitForTransactionConfirmation(result);
    console.log(`${BLOCKCHAIN_EXPLORERS[11155111]}/tx/${result}`);
  } catch (error) {
    console.log({ error });
  }
};

// // IF You want to work for specific network than configure this
const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CHAIN_ID_REQUIRED.toString(16)}` }],
    });
  } catch (error) {
    console.log({ error });
  }
};

window.onload = async (event) => {
  // Updated on 20 nov

  // Event Interactions
  document
    .getElementById("connectBtn")
    .addEventListener("click", () => connect());

  document
    .getElementById("disconnectBtn")
    .addEventListener("click", () => disconnect());

  document.getElementById("getBalance").addEventListener("click", () => {
    tokenBalance();
    Balance_Of_Token();
  });

  document
    .getElementById("transferBtn")
    .addEventListener("click", () => transferMetamask());

  document
    .getElementById("claimToken")
    .addEventListener("click", () => Claim_Balance());

  document
    .getElementById("endTimeBtn")
    .addEventListener("click", () => updateEndTime());

  document
    .getElementById("BonnusGet")
    .addEventListener("click", () => getClaimBonusTokenBalance());

  document
    .getElementById("claimBonus")
    .addEventListener("click", () => claimBonusToken());

  document
    .getElementById("updateRewardBtn")
    .addEventListener("click", () => updateRewardPercentage());

  document
    .getElementById("mintBtn")
    .addEventListener("click", () => mintTokens());

  // Check if browser has wallet integration
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("chainChanged", function (networkId) {
      switchNetwork();
    });
  } else {
    alert("Redirecting to Install metamask");
    window.location =
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
  }

  switchNetwork();

  // Check if already connected with the number of permissions we have
  const hasWalletPermissions = await window.ethereum.request({
    method: "wallet_getPermissions",
  });

  // Retrieve wallet connection preference from localStorage
  const shouldBeConnected =
    JSON.parse(localStorage.getItem(WALLET_CONNECTION_PREF_KEY)) || false;

  // If wallet has permissions update the site UI
  if (hasWalletPermissions.length > 0 && shouldBeConnected) {
    // Retrieve chain
    await ethereum.request({ method: "eth_chainId" });
    connect();
  }
  // Updated on 21 nov
  // if the wallet permissions are present, this code asynchronously fetches the total supply of a token and its current price
  if (hasWalletPermissions.length > 0) {
    await totalSupply();
    await get_priceToken();

    await tokenBalance();
    await Balance_Of_Token();
    await getTotalTokenSold();
    await getStartTime();
    await getEndtTime();
  }
};
