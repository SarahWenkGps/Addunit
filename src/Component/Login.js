import React, { Component } from 'react';
import './task.css';
import Iframe from 'react-iframe';
import host from './host';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
   
  }
 
  render() {
    return (
    // <div id='rrlogin'>
     
      <Iframe url="http://tracking.wenkgps.com/login.html?access_type=-1&duration=3600&redirect_uri=http://add-unit.herokuapp.com/Home"
        width="100%"
       height="550px"
        id="myId"
        className="myClassname"
        allow="fullscreen"
        scrolling ="no"
       />
        

        // </div> 
    );
  }
}
export default Login;



