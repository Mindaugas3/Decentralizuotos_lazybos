const { assert } = require('chai');

const BettingManager = artifacts.require("./BettingManager.sol");
const Bet= artifacts.require("./Bet.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('BettingManager', (bettors) => {
    let betting;

    before(async() => {
        betting = await BettingManager.deployed();
        let isBetDeployed = await Bet.deployed();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = await betting.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, undefined);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
        });

        it('has a name', async() => {
            const name = await betting.bettingName();
            assert.equal(name, "decentralizuotos lazybos: ");
        });
    });

    describe('bets', async() => {

        let result, bettingCounter;

        let amount = 1; //kiek eterio pastatem

        before(async() => {
            result = await betting.createBet("Basketball", "Rytas-Zalgiris", 12, {from: bettors[3], value: web3.utils.toWei('0.1', 'Ether')});
            bettingCounter = await betting.BetCounter();
        });

        it('increments counter', async() => {
            assert.equal(bettingCounter, 1);
        });

        it('passes correct results', async() => {
            //success
            const event = result.logs[1].args;
            // console.log(web3.utils.fromWei(result.logs[0].args.balance_), "Ether");
            // console.log(event);
            assert.equal(event.id.toNumber(), 0, 'id is correct');
            assert.equal(event.sport, "Basketball" , 'sports title is correct');
            assert.equal(event.matchoff, "Rytas-Zalgiris" , 'match title is correct');
            assert.equal(event.coefficient.toNumber(), 12 , 'Coefficient value is correct');
            assert.equal(web3.utils.fromWei(event.amount, "Ether"), 0.1, 'betting amount is correct');
            assert.equal(event.completed, false, 'checking if completed is correct');
            assert.equal(event.bettor, bettors[3] , 'bettor address is correct');

            //failure
            await betting.createBet('', "Rytas-Zalgiris", 12, {from: bettors[0], value: web3.utils.toWei('1', 'Ether')}).should.be.rejected; // sports name?
            await betting.createBet('Basketball', "", 12, {from: bettors[0], value: web3.utils.toWei('1', 'Ether')}).should.be.rejected; //match name?
            await betting.createBet('Basketball', "Rytas-Zalgiris", 0, {from: bettors[0], value: web3.utils.toWei('1', 'Ether')}).should.be.rejected; //coefficient is zero
            await betting.createBet('Basketball', "Rytas-Zalgiris", 12, {from: bettors[0], value: 0}).should.be.rejected; //amount not more than zero
        });

        it('lists bets', async() => {
            const bets = await Bet.at(await betting.bets(0));

            console.log("Bet value: " + web3.utils.fromWei(await bets.getVal.call(), "Ether"));

            assert.equal((await bets.id()).toNumber(), 0, 'id is correct'); 
            assert.equal(await bets.sport(), "Basketball" , 'sports title is correct');
            assert.equal(await bets.matchoff(), "Rytas-Zalgiris" , 'match title is correct');
            assert.equal((await bets.coefficient()).toNumber(), 12 , 'Coefficient value is correct');
            assert.equal(web3.utils.fromWei(await bets.getVal.call(), "Ether"), 0.1, 'betting amount is correct');
            assert.equal(await bets.isCompleted(), false, 'checking if completed is correct');
            assert.equal(await bets.bettor(), bettors[3] , 'bettor address is correct');
        });

        it('commits bets', async() => {
            //success
            const bets1 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '12', {from: bettors[9], value: web3.utils.toWei('1', "Ether")});
            const bets2 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '-12', {from: bettors[3], value: web3.utils.toWei('10', "Ether")});
            const bets3 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '7', {from: bettors[4], value: web3.utils.toWei('1', "Ether")});
            const bets4 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '2', {from: bettors[5], value: web3.utils.toWei('1', "Ether")});

            const commited = await betting.commitBets('Basketball', 'Rytas-Panathinaikos', '4');
            const eventList = commited.logs;

            assert.equal(eventList[0].args.addr, bettors[5], "Winner is correct");
            assert.equal(eventList[0].args.sport, "Basketball", "Sport is correct");
            assert.equal(eventList[0].args.matchoff, "Rytas-Panathinaikos", "Matchoff is correct");
            //failure
            //no such betting created
            //await betting.commitBets('Football', 'Lietuva-Serbija', '-4').should.be.rejected;

        });

        it('charges money', async() => {
            let __price = '1';
            let __price_with_gas = parseInt(__price) + 0.15;
            let _oldBettorBalance = await web3.eth.getBalance(bettors[2]); //paimamamas 2-o lazybininko balansas
            let _oldbalInEthereum = web3.utils.fromWei(_oldBettorBalance, "Ether");
            await betting.createBet('Basketball', "Rytas-Panathinaikos", '7', {from: bettors[2], value: web3.utils.toWei(__price, "Ether")});
            let _newBettorBalance = await web3.eth.getBalance(bettors[2]); //paimamamas 2-o lazybininko balansas
            let _newBalInEthereum = web3.utils.fromWei(_newBettorBalance, "Ether");

            assert.isAtMost(_oldbalInEthereum - _newBalInEthereum, __price_with_gas, "Charges the correct amount of money during deposit");
        });

        it('transfers money to winners account', async() => {
            //get winners balance
            let oldBettorBalance = await web3.eth.getBalance(bettors[5]); //paimamamas 2-o lazybininko balansas
            let oldbalInEthereum = web3.utils.fromWei(oldBettorBalance, "Ether");
            //create batch of bets and commit them into BlockChain
            let bets1 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '12', {from: bettors[9], value: web3.utils.toWei('1', "Ether")});
            let bets2 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '-12', {from: bettors[3], value: web3.utils.toWei('10', "Ether")});
            let bets3 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '7', {from: bettors[4], value: web3.utils.toWei('1', "Ether")});
            let bets4 = await betting.createBet('Basketball', "Rytas-Panathinaikos", '2', {from: bettors[5], value: web3.utils.toWei('1', "Ether")});

            let commited = await betting.commitBets('Basketball', 'Rytas-Panathinaikos', '4');
            let eventList = commited.logs;
            //validate commited bet
            assert.equal(eventList[0].args.addr, bettors[5], "Winner is correct");
            assert.equal(eventList[0].args.sport, "Basketball", "Sport is correct");
            assert.equal(eventList[0].args.matchoff, "Rytas-Panathinaikos", "Matchoff is correct");

            //get winners balance and assert changes are correct
            let newBettorBalance = await web3.eth.getBalance(bettors[5]); //paimamamas 2-o lazybininko balansas
            let newBalInEthereum = web3.utils.fromWei(newBettorBalance, "Ether");

            assert.isAtLeast(newBalInEthereum - oldbalInEthereum, 11, "Awards the winner with the correct amount of money");
        });
    });
});