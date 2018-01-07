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

import 'zeppelin/contracts/crowdsale/Crowdsale.sol';

/**
 * @title PresaleEnabled
 * @dev Extension of Crowdsale with an invite only presale
 */
contract PresaleEnabled is Crowdsale {
  address private invitationSigner;
  
  uint256 public presaleStarts;
  uint256 public presaleRate;

  function PresaleEnabled(uint256 _presaleStartBlock, address _signer, uint256 _presaleRate) {
    require(_signer != 0x0);

    presaleStarts = _presaleStartBlock;
    invitationSigner = _signer;
    presaleRate = _presaleRate;
  }

  function buyPresaleTokens(bytes _inviteCode) payable {
    require(validePresalePurchase(_inviteCode));

    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 tokens = weiAmount.mul(presaleRate);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.mint(msg.sender, tokens);
    TokenPurchase(msg.sender, msg.sender, weiAmount, tokens);

    forwardFunds();
  }

  event Log(uint256 today, uint256 start, uint256 end, uint256 presale);

  function validePresalePurchase(bytes _inviteCode) internal constant returns (bool) {
    bool isCodeValid = _getCodeSigner(_inviteCode) == invitationSigner;
    bool withinPeriod = now >= presaleStarts && now < startTime;

    Log(now, startTime, endTime, presaleStarts);

    return isCodeValid && withinPeriod;
  }

  function _getCodeSigner(bytes _inviteCode) internal constant returns (address) {
    if (_inviteCode.length != 65) return address(0x0);

    bytes32 r;
    bytes32 s;
    uint8 v;
    assembly {
      r := mload(add(_inviteCode, 32))
      s := mload(add(_inviteCode, 64))
      v := and(mload(add(_inviteCode, 65)), 255)
    }
          
    if (v < 27) v += 27;
    
    bytes memory prefix = "\x19Ethereum Signed Message:\n20";
    return ecrecover(sha3(prefix, msg.sender), v, r, s);
  }
}
