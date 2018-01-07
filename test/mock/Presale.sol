import '../../contracts/PresaleEnabled.sol';
import 'zeppelin/contracts/crowdsale/Crowdsale.sol';
import 'zeppelin/contracts/token/MintableToken.sol';

/**
 * @title Presale
 * @dev Presale mock to be used in tests
 */
contract Presale is PresaleEnabled {
	function Presale(
		uint256 _startTime,
		uint256 _endTime,
		uint256 _rate,
		address _wallet,
		uint256 _presaleStartBlock,
		address _signer,
		uint256 _presaleRate
	) 
		PresaleEnabled(_presaleStartBlock, _signer, _presaleRate)
		Crowdsale(_startTime, _endTime, _rate, _wallet)
	{
		// Make sure the presale period is correctly configured
		require(_presaleStartBlock < _startTime);
	}

	function createTokenContract() internal returns (MintableToken) {
	  return new MintableToken();
	}
}