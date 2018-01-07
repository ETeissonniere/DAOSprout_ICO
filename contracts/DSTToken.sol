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

import "zeppelin/contracts/token/MintableToken.sol";

/**
 * @title DSTToken
 * @dev DST token to be sold during our sale.
 */
contract DSTToken is MintableToken {
  string public constant name = "DAOSprout Token";
  string public constant symbol = "DST";
  uint8 public constant decimals = 18;
}
