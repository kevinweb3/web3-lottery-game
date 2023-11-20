// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Lottery {
    address public owner; // 合约创建者
    address payable[] public players; // 玩家address数组集合
    event WinnerPicked(uint index, uint prize, address winner); // 获胜获奖事件

    constructor() {
        owner = msg.sender;
    }

    modifier minimun(uint value) {
        string memory requiredMsg = string.concat(
            "The minimum value required is ",
            Strings.toString(value)
        );
        require(msg.value >= value, requiredMsg);
        _;
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "Only the owner of this contract can call the function"
        );
        _;
    }

    // 玩家进入play需要支付最低的ether
    function enter() public payable minimun(.01 ether) {
        players.push(payable(msg.sender));
    }

    // 生成链上随机数
    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, players)
                )
            );
    }

    // 获取所有玩家
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    // 玩家获胜
    function pickWinner() public restricted {
        uint index = random() % players.length;
        uint prize = address(this).balance;
        address payable winner = players[index];
        winner.transfer(prize);
        players = new address payable[](0);
        emit WinnerPicked(index, prize, winner);
    }
}
