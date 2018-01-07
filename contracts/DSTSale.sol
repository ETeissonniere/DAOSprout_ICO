/**
 * Copyright © 2017 Eliott Teissonniere <http://eliott.tech>.
 *
 * ALL RIGHTS RESERVED.
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software. Removing the above copyright
 * notice without any prior written agreement from Eliott Teissonniere is a
 * copyright and intellectual property violation.
 */

pragma solidity ^0.4.11;

import 'zeppelin/contracts/crowdsale/CappedCrowdsale.sol';
import 'zeppelin/contracts/token/MintableToken.sol';

import './PresaleEnabled.sol';
import './DSTToken.sol';

/**
 * @title DSTSale
 * @dev DAO Sprout ICO contract
 */
contract DSTSale is CappedCrowdsale, PresaleEnabled {
	function DSTSale(
		uint256 _startTime,
		uint256 _endTime,
		uint256 _rate,
		uint256 _cap,
		address _wallet,
		uint256 _presaleStartBlock,
		address _signer,
		uint256 _presaleRate
	) 
		CappedCrowdsale(_cap)
		PresaleEnabled(_presaleStartBlock, _signer, _presaleRate)
		Crowdsale(_startTime, _endTime, _rate, _wallet)
	{
		// Make sure the presale period is correctly configured
		require(_presaleStartBlock < _startTime);
	}

	function createTokenContract() internal returns (MintableToken) {
		return new DSTToken();
	}
}
