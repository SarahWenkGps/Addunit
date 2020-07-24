import React,{Component} from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Cookies from "universal-cookie";
const cookies = new Cookies();
class Succes extends Component{
    constructor(props) {
        super(props);
        this.state = {
        data1:[],
        data:[],
        }
       
      }
     

   

    render(){
      
      


        return(
            <div>

<Navbar expand="lg" id="navmai">


<Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('../assets/img/logo.png')} style={{ height: 30 }} alt='alt' /> </Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
<Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

  <div id='itemnav' >


    <div id='teamnav'>
     
 
    
   
      <Tooltip title="Logout" onClick={() => {
        cookies.remove("token");
        window.location.href = "/"
      }}   >
        <IconButton aria-label="Logout">
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
    </div>

  </div>




</Navbar.Collapse>

</Navbar>
<Link to ={`/User?id=${cookies.get('iduser')}&nm=${cookies.get('username')}`}>
<div style={{width:'20%',textAlign:'center',marginTop:'2%',cursor:'pointer'}}  >
    <KeyboardReturnIcon style={{color:'rgb(10, 98, 142)',boxShadow:'1px 1px 3px gray',fontSize:'30px'}}  />
    </div></Link>
<div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div id='txtf'  >All Units Adding Successfully</div>
</div>
<div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2%',flexDirection:'column'}} >

<img src={require('../assets/img/traffic-jam.png')} alt='alt' style={{height:'130px'}} />

<img src={require('../assets/img/tick.png')} alt='alt' style={{height:'130px'}} />
                </div>


            </div>
        );
        }
    
}
export default Succes;