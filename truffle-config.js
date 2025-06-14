module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",   // any network is fine
      chainId: 1337      // keep MetaMask & Ganache happy
    }
  },
  compilers: {
    solc: {
      version: "0.8.20"  // <-- match the pragma in YOUR contracts
    }
  }
};
