pragma solidity ^0.5.0; //0.5.0

import "./Bet.sol";

contract BettingManager {

    uint public BetCounter = 0;
    mapping(uint => Bet) public bets;
    string public bettingName;

    event BetCreated (
        uint id,
        uint256 time, //kada? 2020-12-19
        string sport, //"Basketball", "Boxing" ...
        string matchoff, //"Rytas - Zalgiris", "Connor McGregor - Khabib Nurmagomedov" ...
    //unique
        uint amount, //kiek pinigu pastate?
    //unique
        int coefficient, //kofas gali buti teigiamas arba neigiamas
    //unique
        address payable bettor, //kas pastate uz komanda X su kokiu kofu
        bool completed //ar jau gavo pinigu uz lazybas(arba jas atsauke)?
    );

    event WinnerPicked(
        address payable addr,
        string sport,
        string matchoff
    );

    event WinnerPaid(
        address payable addr,
        address payable sendr,
        uint amount
    );

    event CoefficientDiffFound(
        int sbCoef,
        int coefDiff,
        int result
    );

    event CoefficientDiffNotFound(
        int sbCoef,
        int coefDiff,
        int result
    );

    event BetChecked(
        uint id,
        string sports,
        string matchoff,
        address payable bettor,
        bool completed
    );

    event ExceptionThrown(
        bytes data
    );

    event TransactionSuccessful();
    event TransactionFailed();
    event ThisBalance(
        uint balance_
    );

    constructor() public {
        bettingName = "decentralizuotos lazybos: ";
    }

    function createBet(string calldata _sport, string calldata _matchoff, int _coefficient) external payable {

        //tikriname
        require(bytes(_sport).length > 0, "revert: sports empty");
        require(bytes(_matchoff).length > 0, "revert: matchoff empty");
        require(_coefficient != 0, "coefficient must not be null"); //gali buti neigiamas arba teigiamas bet ne 0
        require(msg.value > 0, "bet money must not be null"); //kiek pastatem

        emit ThisBalance(address(this).balance);
        //issaugome
        bets[BetCounter] = (new Bet).value((address(this).balance))(BetCounter);
        address payable betContract = address(uint160(address(bets[BetCounter])));

        //betContract.send((address(this).balance));
        bets[BetCounter].params(_sport, _matchoff, _coefficient);
        //siunciame event'a
        emit BetCreated(BetCounter, now, _sport, _matchoff, msg.value, _coefficient, msg.sender, false);
        // padidiname betCounter
        BetCounter++;
    }

    function commitBets(string calldata _sport, string calldata _matchoff, int resultCoefficient) external {

        Bet [] memory eligibleBets;
        uint [] memory eligibleIDs = new uint [](BetCounter);
        uint eligCounter = 0;
        Bet winnerContract;
        address payable winner;

        int coeffDifference = 10000; //skirtumas tarp ivesto koeficiento ir gauto koeficiento
        for(uint i = 0; i < BetCounter; i++){ //palyginame kofa su rungtynese gautu kofu
            Bet singleBet = bets[i];
            //emit BetChecked(singleBet.id, singleBet.sport, singleBet.matchoff, singleBet.bettor, singleBet.completed);
            if(singleBet.isCompleted() == false &&
            address(singleBet.bettor()) != address(0) &&
            keccak256(bytes(singleBet.sport())) == keccak256(bytes(_sport)) &&
                keccak256(bytes(singleBet.matchoff())) == keccak256(bytes(_matchoff))){

                //push
                eligibleIDs[eligCounter] = singleBet.id();

                eligCounter++;
                //renkam kofa
                int sbCoefficient = singleBet.coefficient();
                if(abs(abs(sbCoefficient) - abs(resultCoefficient)) < abs(coeffDifference)){
                    coeffDifference = abs(abs(sbCoefficient) - abs(resultCoefficient));
                    winner = singleBet.bettor();
                    winnerContract = singleBet;
                    //emit CoefficientDiffFound(sbCoefficient, coeffDifference, resultCoefficient);
                } else {
                    //emit CoefficientDiffNotFound(sbCoefficient, coeffDifference, resultCoefficient);
                }
            }
        }

        emit WinnerPicked(winner, _sport, _matchoff);

        for(uint i = 0; i < eligCounter; i++){

            uint _IDNum = eligibleIDs[i];
            address payable _bettor = bets[eligibleIDs[i]].bettor();

            Bet unpaidBet = bets[_IDNum];
            unpaidBet.complete(); //set bet with ID to complete

            bets[_IDNum] = unpaidBet;

            if(unpaidBet.bettor() != winner){
                emit WinnerPaid(winner, unpaidBet.bettor(), unpaidBet.amount());
                if(unpaidBet.amount() > 0){
                    unpaidBet.sendMoney(winner);
                }
            }
        }
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
}