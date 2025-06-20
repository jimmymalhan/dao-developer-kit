import React from "react";
import {
  RPC,
  vrtAddress,
  vrtABI,
  daoABI,
  daoAddress,
} from "../Constants/config";
import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const vrtContract = new web3.eth.Contract(vrtABI, vrtAddress);
const daoContract = new web3.eth.Contract(daoABI, daoAddress);

const initialState = {
  web3: web3,
  account: "",
  daoContract: daoContract,
  vrtContract: vrtContract,
};

const Web3Context = React.createContext({
  ...initialState,
});

export const Web3Provider = ({ children }) => {
  const [data, setData] = React.useState({ ...initialState });

  React.useEffect(() => {}, []);

  const walletConnect = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(1666600000) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: web3.utils.toHex(1666600000),
                chainName: "Harmony Mainnet",
                rpcUrls: ["https://api.harmony.one"],
                nativeCurrency: {
                  name: "ONE",
                  symbol: "ONE", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: "https://explorer.harmony.one/",
              },
            ],
          });
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.utils.toHex(1666600000) }],
          });
        } catch (addError) {}
      }
    }

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const clientWeb3 = window.web3;
      const accounts = await clientWeb3.eth.getAccounts();
      setData({ ...data, account: accounts[0] });
      await getPosition(accounts[0]);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      const clientWeb3 = window.web3;
      const accounts = await clientWeb3.eth.getAccounts();
      setData({ ...data, account: accounts[0] });
      await getPosition(accounts[0]);
    }

    const { ethereum } = window;
    ethereum.on("accountsChanged", async (accounts) => {
      try {
        accounts = web3.utils.toChecksumAddress(accounts + "");
      } catch (err) {}

      setData({ ...data, account: accounts });
    });

    ethereum.on("chainChanged", async (chainId) => {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(1666600000) }],
      });
    });
  };

  const getPosition = async (address) => {
    const balance = await vrtContract.methods.balanceOf(address).call();
    const owner = await daoContract.methods.owner().call();
    const admin = await daoContract.methods.admin().call();

    if (address === owner) {
      setData({ ...data, position: "OWNER" });
    } else if (address === admin) {
      setData({ ...data, position: "ADMIN" });
    } else {
      if (balance > 0) {
        setData({ ...data, position: "MEMBER" });
      } else {
        setData({ ...data, position: "GUEST" });
      }
    }
  };

  return (
    <Web3Context.Provider value={{ ...data, walletConnect }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
