const {currentBlock, jumpToBlock} = require('./helpers/time.js')
const {EVMGeneric} = require('./helpers/evm_errors.js')

const presale = artifacts.require('./mock/Presale.sol')
const token = artifacts.require('MintableToken.sol')

const BigNumber = web3.BigNumber

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should()

function build_invite_code(target_buyer, signer) {
	return web3.eth.sign(signer, target_buyer)
}

contract('PresaleEnabled', accounts => {
	describe('deploy contract', () => {
		it('refuses to deploy if signer is null', async () => {
			await presale.new(
				99,  // _startTime
				999, // _endTime
				2,   // _rate
				0x2, // _wallet
				1,   // _presaleStartBlock
				0,   // _signer: 0x0, should throw
				100  // _presaleRate
			).should.be.rejectedWith(EVMGeneric)
		})
	})

	context('contract is deployed correctly', () => {
		let presale_contract, sold_token

		let signer = accounts[0]

		let presale_rate = new BigNumber(100)
		const value = web3.toWei(0.1, 'ether')
		const expectedTokenAmount = presale_rate.mul(value)

		beforeEach(async () => {
			let block = await currentBlock()

			presale_contract = await presale.new(
				block + 100,  // _startTime
				block + 1000, // _endTime
				2,            // _rate
				0x2,          // _wallet
				block,        // _presaleStartBlock
				accounts[1],  // _signer
				presale_rate  // _presaleRate
			)

			sold_token = token.at(await presale_contract.token())
		})

		describe('accepting orders', () => {
			it('accepts presale payment with a valid code', async () => {
				var code = build_invite_code(accounts[0], accounts[1])
				await presale_contract.buyPresaleTokens(code, {value: value}).should.be.fulfilled
			})

			it('credit tokens to buyer', async () => {
				var code = build_invite_code(accounts[0], accounts[1])
				await presale_contract.buyPresaleTokens(code, {value: value})

				let balance = await sold_token.balanceOf(accounts[0])
				balance.should.be.bignumber.equal(expectedTokenAmount)
			})

			it('increases the raised amount', async () => {
				var code = build_invite_code(accounts[0], accounts[1])
				await presale_contract.buyPresaleTokens(code, {value: value})

				let weiRaised = await presale_contract.weiRaised()
				weiRaised.should.be.bignumber.equal(value)
			})

			it('logs the event', async () => {
				var code = build_invite_code(accounts[0], accounts[1])
				const {logs} = await presale_contract.buyPresaleTokens(code, {value: value})

				const event = logs.find(e => e.event === 'TokenPurchase')

				event.should.exist
				event.args.purchaser.should.equal(accounts[0])
				event.args.beneficiary.should.equal(accounts[0])
				event.args.value.should.be.bignumber.equal(value)
				event.args.amount.should.be.bignumber.equal(expectedTokenAmount)	
			})

			it('forward funds', async () => {
				var wallet = await presale_contract.wallet()
				var code = build_invite_code(accounts[0], accounts[1])

				const pre = web3.eth.getBalance(wallet)
				await presale_contract.buyPresaleTokens(code, {value: value})

				const post = web3.eth.getBalance(wallet)
				post.minus(pre).should.be.bignumber.equal(value)
			})
		})

		describe('rejects orders', () => {
			describe('rejects wrong codes', () => {
				it('rejects too small code', async () => {
					var wrong_code = build_invite_code(accounts[0], accounts[1]).slice(0, 60) // Codes should be 65 long
					await presale_contract.buyPresaleTokens(wrong_code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})

				it('rejects too big codes', async () => {
					var code = build_invite_code(accounts[0], accounts[1])
					var wrong_code = code + code // Two times longer
					await presale_contract.buyPresaleTokens(wrong_code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})

				it('rejects codes from another investor', async () => {
					var wrong_code = build_invite_code(accounts[2], accounts[1]) // accounts[2] is authorized, no accounts[0]
					await presale_contract.buyPresaleTokens(wrong_code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})

				it('rejects codes signed by the wrong account', async () => {
					var wrong_code = build_invite_code(accounts[0], accounts[2]) // accounts[2] signed
					await presale_contract.buyPresaleTokens(wrong_code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})
			})
			
			describe('rejects if out of period', () => {
				it('rejects if presale has not sarted', async () => {
					let block = await currentBlock()

					presale_contract = await presale.new(
						block + 100,  // _startTime
						block + 1000, // _endTime
						2,            // _rate
						0x2,          // _wallet
						block + 50,   // _presaleStartBlock, 50 blocks in the future
						accounts[1],  // _signer
						presale_rate  // _presaleRate
					)

					var code = build_invite_code(accounts[0], accounts[1])
					await presale_contract.buyPresaleTokens(code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})

				it('rejects if presale has ended', async () => {
					let block = await currentBlock()

					presale_contract = await presale.new(
						block + 10,   // _startTime
						block + 1000, // _endTime
						2,            // _rate
						0x2,          // _wallet
						block,        // _presaleStartBlock
						accounts[1],  // _signer
						presale_rate  // _presaleRate
					)

					// Jump to main sale
					jumpToBlock(20) // 20 just to be sure...

					var code = build_invite_code(accounts[0], accounts[1])
					await presale_contract.buyPresaleTokens(code, {value: value}).should.be.rejectedWith(EVMGeneric)
				})
			})
		})
	})
})
