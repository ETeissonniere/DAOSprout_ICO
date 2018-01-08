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
