jumpToNextBlock = () => {
  web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [12345], id: 0})
  web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0})
}

module.exports = {
  currentBlock: () => {
    return web3.eth.getBlock(web3.eth.blockNumber).timestamp
  },
  jumpToNextBlock: jumpToNextBlock,
  jumpToBlock: block => {
  	for (var i = 0; i < block; i++) {
  		jumpToNextBlock()
  	}
  }
}