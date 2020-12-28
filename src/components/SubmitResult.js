import React, { Component } from 'react';
import './App.css';
import {ListGroup} from 'react-bootstrap';
import {Card} from 'react-bootstrap';

class SubmitResult extends Component {
    //... logika
    constructor(props){
        super(props);
        this.state = {
            sport: "",
            matchoff: "",
            coefficient: 0
        };
    }

    
    handleChange(event) {  
        this.setState({[event.target.name]: event.target.value})
      }
      
    //renderis - 3 teksto laukai ir mygtukas, pavziduoti grazioje formoje
    render(){
        return (
            
            <Card style={{width: 70 + "%", textAlign: "left"}}>
                Pateikti lažybų rezultatą:
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
                    
                    <ListGroup.Item><button type="button" onClick = {() => this.props.commitHandler(this.state.sports, this.state.match, this.state.coefficient, this.state.sum, this.state.currency) }>Pateikti statymo rezultatą</button></ListGroup.Item>
                </ListGroup>
            </Card>
        )
    }
}

export default SubmitResult;