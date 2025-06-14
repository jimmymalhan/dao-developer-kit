import Web3 from 'web3';
import { RPC } from '../Constants/config';

/**
 * Utility functions for interacting with the MetaMask Ethereum provider.
 */
export function getEthereum() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  console.warn('MetaMask not detected. Make sure it is installed and unlocked.');
  return null;
}

export async function requestAccounts() {
  const eth = getEthereum();
  if (!eth) {
    throw new Error('Ethereum provider not found. Please install MetaMask.');
  }
  // Request account access from MetaMask:
  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  return accounts;
}

/**
 * Convenience wrapper that gives you a ready-to-use Web3
 * instance that is *already* wired to the user’s wallet.
 *
 * ```js
 *   const web3 = await getWeb3();
 *   const balance = await web3.eth.getBalance(account);
 * ```
 */
export const getWeb3 = async () => {
  const eth = getEthereum();
  if (!eth) {
    console.warn("No Ethereum wallet found – using fallback RPC provider");
    // Return a Web3 instance connected to the configured RPC
    return new Web3(RPC);
  }

  // make sure at least one account is unlocked
  try {
    await requestAccounts();
  } catch (err) {
    console.warn("Could not get accounts, using read-only mode:", err.message);
  }

  return new Web3(eth);
};