const {currentBlock} = require('./helpers/time.js')
const {EVMGeneric} = require('./helpers/evm_errors.js')

const sale = artifacts.require('DSTSale.sol')

const BigNumber = web3.BigNumber

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

contract('DSTSale', accounts => {
	describe('Deployment', () => {
		it('refuses to deploy if presale is before main sale', async () => {
			await sale.new(
				99,  // _startTime
				999, // _endTime
				2,   // _rate
				900, // _cap
				0x2, // _wallet
				500, // _presaleStartBlock, after _startTime
				0x2, // _signer
				100  // _presaleRate
			).should.be.rejectedWith(EVMGeneric)
		})

		it('deploys correctly', async () => {
			let block = await currentBlock()

			await sale.new(
				block + 99,  // _startTime
				block + 999, // _endTime
				2,           // _rate
				900,         // _cap
				0x2,         // _wallet
				block + 1,   // _presaleStartBlock
				0x2,         // _signer
				100          // _presaleRate
			).should.be.fulfilled
		})
	})
})
