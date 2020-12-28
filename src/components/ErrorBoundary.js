import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import MMSettings from "../ErrorImage.png"
import Text from "react-dom"
//import { Alert.Heading } from 'react-bootstrap';

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
        this.state = { 
            hasError: false,
            errorMessage: ""
        };
        console.log(this.props.message);
    }
  
    static getDerivedStateFromError(error) {    // Update state so the next render will show the fallback UI.    
        return { hasError: true };  
    }

    render() {
            // You can render any custom fallback UI      
        return (
            <Alert variant="danger">
            <Alert.Heading style={{backgroundColor:"red"}}>Klaida!</Alert.Heading>
                <p><strong>{this.props.message}</strong></p>
                <ul style={{textAlign:"left", margin: "auto", display: "inline-block", width: 70 + "%"}}>
                    <li>Patikrinkite, ar MetaMask įskiepis įdiegtas</li>
                    <li>Patikrinkite, ar Ganache veikia:</li>
                    <li>Patikrinkite, ar MetaMask prisijungta prie: <br/>
                        <img src={MMSettings} alt="MetaMask Settings" />
                    </li>
                    <div style={{textAlign:"left"}}>
                    <strong>Pastaba:</strong> Grandinės ID galite sužinoti paleidę <code style= {{backgroundColor: "lightgray"}} >truffle console</code> ir suvedę šią komandą: <br/>
                    <code style= {{backgroundColor: "lightgray"}} >const chainId = await web3.eth.getChainId();</code><br/>
                    <code style= {{backgroundColor: "lightgray"}} >chainId</code>
                    </div>
                </ul>
            
            </Alert>
        );
      //return this.props.children; 
    }
  }

  export default ErrorBoundary;