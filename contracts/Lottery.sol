//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is ERC721, Ownable {
    // injection
    using Counters for Counters.Counter;

    Counters.Counter public _ticketIds;

    Counters.Counter private _batchIds;

    // mapping
 
    mapping(uint256 => address) public ticketToOwner;

    mapping(address => uint256[]) public ownerTickets;

    // variables

    uint256 public totalTicket;

    uint256 public maxTicketPerUser;

    uint256 public ticketFee;

    uint256 public oldRoundTicket;

    address public ticketFunder;

    address public lastWinner;

    // event

    event CreateTicket(address _recipient, uint256 _ticketId);

    // function

    constructor() ERC721("TicketContract", "TKG") {}

    function setTotalTicket(uint256 _totalTicket) public onlyOwner() {
        totalTicket = _totalTicket;
    }

    function setMaxTicketPerUser(uint256 _maxTicket) public onlyOwner() {
        maxTicketPerUser = _maxTicket;
    }

    function setTicketFunder(address _address) public onlyOwner() {
        ticketFunder = _address;
    }

    function setTicketFee(uint256 _ticketFee) public onlyOwner() {
        ticketFee = _ticketFee;
    }

    function buyTicket(uint256 _ticketId) public payable {
        // check condition
        require(ticketToOwner[_ticketId] == address(0), "ticket has bought");

        require(_ticketId > oldRoundTicket, "cannot buy last round ticket");

        require(
            _ticketId <= oldRoundTicket + totalTicket,
            "ticket hasn't created yet"
        );

        require(
            balanceOf(msg.sender) < maxTicketPerUser,
            "exceed tickets per user"
        );

        // send fee
        require(msg.value == ticketFee, "wrong prize ticket");
        // transfer token 
        safeTransferFrom(ticketFunder, msg.sender, _ticketId);

        // assign buyer 
        ticketToOwner[_ticketId] = msg.sender;
        ownerTickets[msg.sender].push(_ticketId);
    }

    function createBatchTicket(uint256 _amount, address _recipient) public onlyOwner() {
        _batchIds.increment();

        uint256 newBatchId = _batchIds.current();

        for (uint i = 0; i < _amount; i++) {
            _createTicket(_recipient, newBatchId);
        }
    }

    function rewardAndCreateNewRound() external onlyOwner() {
        oldRoundTicket = oldRoundTicket + totalTicket;
        // create random number ids
        uint256 ticketIdReward = 
            uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % totalTicket + oldRoundTicket;

        if(ticketToOwner[ticketIdReward] != address(0)) {
            lastWinner = ticketToOwner[ticketIdReward];
            uint256 rewardAmount = address(this).balance;

            // send reward
            (bool _sent, ) = lastWinner.call{value: rewardAmount}("");
            require(_sent, "Failed to send ether");
        }
    }

    // view and pure fucntion


    // internal function

    function _createTicket(address _recipient, uint256 _batchId) internal {
        _ticketIds.increment();

        uint256 newTicketId = _ticketIds.current();

        require(
            newTicketId <= oldRoundTicket + totalTicket, 
            "exceed of max ticket"
        );

        _mint(_recipient, newTicketId);

        emit CreateTicket(_recipient, _batchId);
    }
}