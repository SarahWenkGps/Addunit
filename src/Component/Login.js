import React, { Component } from 'react';
import '../assets/css/task.css';
// import Iframe from 'react-iframe';
import host from './host';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
   
  }
 componentDidMount(){
  window.location.href=`http://tracking.wenkgps.com/login.html?access_type=-1&duration=18000&client_id=Add%20Units&redirect_uri=${host}Si`
 }
  render() {
    return (
    <div style={{width:'100%',height:'100vh'}}>
     
      {/* <Iframe url={`http://tracking.wenkgps.com/login.html?access_type=-1&duration=18000&redirect_uri=${host}Home`} */}
       {/* width="100%"
       height="550px"
       
        
       allow="fullscreen"
     
        /> */}
   


      </div> 
    );
  }
}
export default Login;



