// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VeganRobDAO {
    mapping(uint256 => uint256[2]) public votes;     // id ⇒ [yes,no]

    function vote(uint256 id, bool choice) external {
        votes[id][choice ? 0 : 1] += 1;
    }
}
