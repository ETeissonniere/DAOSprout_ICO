var sale = artifacts.require("DSTSale.sol")

module.exports = function(deployer) {
	deployer.deploy(
		sale,
		999999999999,    // _startTime
		99999999999999,  // _endTime
		1,               // _rate
		1,               // _cap
		"0xdeaddead",    // _wallet
		9999999999,      // _presaleStartBlock
		"0xbeefbeef",    // _signer
		10               // _presaleRate
	)
}
