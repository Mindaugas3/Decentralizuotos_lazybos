pragma solidity ^0.5.0; //0.5.0

contract Bet {
    //state variables
    uint public id;
    uint256 public time; //kada? 2020-12-19
    string public sport; //"Basketball", "Boxing" ...
    string public matchoff; //"Rytas - Zalgiris", "Connor McGregor - Khabib Nurmagomedov" ...
    //unique
    uint256 public amount; //kiek pinigu pastate?
    //unique
    int public coefficient; //kofas gali buti teigiamas arba neigiamas
    //unique
    address payable public bettor; //kas pastate uz komanda X su kokiu kofu
    bool public isCompleted; //ar jau gavo pinigu uz lazybas(arba jas atsauke)?

    //sukonstruojame statyma
    constructor(uint _id) public payable {
        //...
        id = _id;
        time = now;
        uint256 _amt = msg.value;
        bettor = tx.origin;
        amount = _amt;
        isCompleted = false;
    }

    function params(string memory _sport, string memory _matchoff, int _coeff) public {
        sport = _sport;
        matchoff = _matchoff;
        coefficient = _coeff;

    }

    function sendMoney(address payable _target) public {
        isCompleted = true;
        _target.transfer(amount);
    }

    //gauna laimetojas
    function receiveMoney() public payable {
        uint256 _amt = msg.value;
        amount += _amt;
        isCompleted = true;
    }

    //pinigus galima issimt
    function withdraw() public{
        //validate
        assert(isCompleted == true);
        require(amount > 0, "Nepakanka pinigu!");
        //transfer

        bettor.transfer(address(this).balance);
    }

    function getVal() public returns (uint256)  {
        return address(this).balance;
    }

    function complete() public{
        isCompleted = true;
    }
}