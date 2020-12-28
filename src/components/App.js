import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import ErrorBoundary from "./ErrorBoundary.js"
import SuccessView from "./Success.js"
import BettingManager from "../abis/BettingManager.json";
import Bet from "../abis/Bet.json";
import SubmitResult from './SubmitResult';

class App extends Component {

  async componentWillMount(){ //promise pattern
    await this.loadWeb3().then(async () => {
        await this.bindAccount().then( async () => {
          await this.loadBettingMgr().then(async () => {
            //await this.loadSingleBet();
          });
        });
    });
    

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      this.setState({error:true});
      this.setState({errorMsg: "Prašome naudoti MetaMask įskiepį arba Ethereum kriptovaliutą palaikančią naršyklę!"});
      //window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBettingMgr(){

    const networkId = await window.ethereum.networkVersion;
    console.log(networkId);
    const networkData = BettingManager.networks[networkId];
    console.log(networkData);
    if (networkData) {
        const bettingManager = new window.web3.eth.Contract(BettingManager.abi, networkData.address);
        bettingManager.handleRevert = true;
        this.setState({mgr: bettingManager});
        //say the page is loaded

    } else {
        //error
        this.setState({error:true});
        this.setState({errorMsg: "Nepavyko prisijungti prie blokų grandinės!\n Neužsikrauna kontraktai!"});
        console.log(this.state.errorMsg);
    }
  }

  async loadSingleBet(){

    const networkId = await window.web3.eth.networkId();
    alert(networkId);
    const networkData = Bet.networks[networkId];

    if (networkData) {
        const bet = new window.web3.eth.Contract(Bet.abi, networkData.address);
        bet.handleRevert = true;
        window.singleBet = bet;
        //pass contract to state

        //say the page is loaded
    } else {
        this.setState({error:true});
        this.setState({errorMsg: "Nepavyko prisijungti prie blokų grandinės! Neužsikrauna kontraktai!"});
    }
  }

  async bindAccount(){
    const web3 = window.web3;
    if(!web3) return;
    let accounts;
    await web3.eth.getAccounts((error, _accounts) => {
      accounts = _accounts;
      this.setState({account: accounts[0]});
    }).then(async () => {
      this.setState({balance: web3.utils.fromWei(await web3.eth.getBalance(this.state.account))})
    });
  }

  constructor(props){
    super(props);
    this.state = {
      account : "",
      balance: 0,
      loading: true,
      error: false,
      errorMsg: "",
      isCompleted: false,
      bet : {
        sport: "",
        match: "",
        coefficient: 0,
        sum: 0,
        currency: "Ether"
      }
    };
    this.handler = this.handler.bind(this);
    this.commitHandler = this.commitHandler.bind(this);
  }

  handler(_sports, _match, _coefficient, _sum, _currency) {

    console.log(_sports, _match, _coefficient);
    console.log(this.state.account);
    console.log(window.web3.utils.toWei(_sum.toString(), _currency));
    
    this.state.mgr.methods.createBet(_sports, _match, _coefficient).send({from: this.state.account, value: window.web3.utils.toWei(_sum.toString(), _currency)});
  }

  commitHandler(_sports, _match, _coefficient) {
    this.state.mgr.methods.commitBets(_sports, _match, _coefficient).send({from: this.state.account});
  }

  render() {
    
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Decentralizuotos lažybos
            </a>
            <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
          </nav>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                <br/>
                <br/>  
                { this.state.error ? <ErrorBoundary message={this.state.errorMsg} visible="false"/> : <div><SuccessView handler={this.handler} address={this.state.account} balance={this.state.balance}/> <SubmitResult commitHandler={this.commitHandler}/></div>}
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  </a>
                  
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    
    
  }
}

export default App;
