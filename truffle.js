var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "act forest much author indoor bench adapt mix pluck movie wood usage"; // 12 word mnemonic

module.exports = {
  networks: {
    kovan_infura: {
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/"),
      network_id: 42
    },
    rinkeby_infura: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"),
      network_id: 4
    }
  }
};
