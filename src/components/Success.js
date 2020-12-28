import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import {ListGroup} from 'react-bootstrap';
import {Card} from 'react-bootstrap';


class SuccessView extends Component {

    constructor(props){
        super(props);
        this.state = {
            sports: "",
            match: "",
            coefficient: 0,
            sum: 0,
            currency: "Ether"
        }
      }


      handleChange(event) {  
          this.setState({[event.target.name]: event.target.value})
        }

      render(){
        return (
            <div>
            <Alert variant="success">
            <Alert.Heading style={{color: "blue"}}>Sėkmingai prisijungta!</Alert.Heading>
                <div style={{textAlign:"left", margin: "auto", display: "inline-block", width: 70 + "%"}}>
                <p><strong>Ethereum piniginės adresas: </strong>{this.props.address}</p>
                <p><strong>Ethereum piniginės likutis: </strong>{this.props.balance} ETH</p>
                </div>
            </Alert>
            <form>
                <Card style={{width: 70 + "%", textAlign: "left"}}>
                    <ListGroup variant="flush" >
                        <ListGroup.Item>
                            <div style={{width: 25 + "%", textAlign: "left", display: 'inline-block', backgroundColor:"lightblue"}}>
                                Sportas:  </div>
                                <input type="text" style={{marginLeft: 8 + "px"}} name="sports" required   onChange={this.handleChange.bind(this)}/>
                            
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <div style={{width: 25 + "%", textAlign: "left", display: 'inline-block', backgroundColor:"lightblue"}} >
                            Rungtynes:  </div>
                            <input type="text" style={{marginLeft: 8 + "px"}} name="match" required   onChange={this.handleChange.bind(this)}/>
                        
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <div style={{width: 25 + "%", textAlign: "left", display: 'inline-block', backgroundColor:"lightblue"}}>
                            Koeficientas:  </div>
                            <input type="text" style={{marginLeft: 8 + "px"}} name="coefficient" required   onChange={this.handleChange.bind(this)}/>
                        
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div style={{width: 25 + "%", textAlign: "left", display: 'inline-block', backgroundColor:"lightblue"}}>
                                Suma:  </div>
                                <input type="text" style={{marginLeft: 8 + "px", marginRight: 4 + "px"}} name="sum" required   onChange={this.handleChange.bind(this)}/>  
                                <select name="currency" required   onChange={this.handleChange.bind(this)}>
                                    <option value="Ether">Ether</option>
                                    <option value="Gwei">Gwei</option>
                                    <option value="Wei">Wei</option>
                                </select>
                            
                    </ListGroup.Item>
                        <ListGroup.Item><button type="button" onClick = {() => this.props.handler(this.state.sports, this.state.match, this.state.coefficient, this.state.sum, this.state.currency) }>Statyti</button></ListGroup.Item>
                    </ListGroup>
                </Card>
            
            
            
        </form>
            
            </div>
        );
      }
}

export default SuccessView;