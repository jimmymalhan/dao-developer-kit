import daoAbi   from '../abi/Dao.json';
import tokenAbi from '../abi/Token.json';

export const RPC = 'https://api.harmony.one';
export const daoABI = daoAbi.abi;          // ← use .abi
export const vrtABI = tokenAbi.abi;        // ← use .abi

export const daoAddress    = process.env.REACT_APP_DAO_CONTRACT;
export const vrtAddress    = process.env.REACT_APP_TOKEN_CONTRACT;
export const pinata_key    = process.env.REACT_APP_PINATA_KEY;
export const pinata_secret = process.env.REACT_APP_PINATA_SECRET;
