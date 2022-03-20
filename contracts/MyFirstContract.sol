// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Crypton is Ownable {
    // contract 0x07d8b075b94F76263f8ED38c79FbCb704e648484
    address[] public items;

    struct Payment {
        uint amount;
        uint timestamp;
        address from;
    }

    struct Balance {
        uint totalPayments;
        mapping(uint => Payment) payments;
    }

    // Общее количество пожертвований по конкретному адресу
    mapping(address => Balance) public balances;
    
    // Сумма пожертвований по конкретному адресу
    mapping(address => uint) public summBalance;

    // Показать общий баланс контракта
    function currentBalance() public view onlyOwner returns(uint) {
        return address(this).balance;
    }

    // Внести пожертвование
    function pay() public payable {
        uint paymentNum = balances[msg.sender].totalPayments;
        balances[msg.sender].totalPayments++;

        summBalance[msg.sender] += msg.value;

        Payment memory newPayment = Payment(
            msg.value,
            block.timestamp,
            msg.sender
        );

        balances[msg.sender].payments[paymentNum] = newPayment;
        
        for(uint256 i = 0; i < items.length; i++) {
            if(items[i] == msg.sender)
                return;
        }
        items.push(msg.sender);
    }

    // Показать информацию по платежу
    function getPayment(address _addr, uint _index) public view onlyOwner returns(Payment memory) {
        return balances[_addr].payments[_index];
    }

    // Вывод определенной суммы на указанный адрес
    function transferTo(address targetAddr, uint amount) public onlyOwner {
        address payable _to = payable(targetAddr);
        _to.transfer(amount);
    }

    // Вывести всё на адрес владельца контракта
    function withdrawAll() public onlyOwner {
        address payable _to = payable(owner());
        address _thisContract = address(this);
        _to.transfer(_thisContract.balance);
    }

    // Показать адреса пользователей, внесших пожертвования
    function getAllAddresses() public view onlyOwner returns(address[] memory) {
        return items;
    }

    // Показать баланс кошелька
    function addrBalance(address targetAddr) public view onlyOwner returns(uint) {
        return targetAddr.balance;
    }
}