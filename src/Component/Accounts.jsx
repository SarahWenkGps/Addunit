import React from 'react';
import './task.css';
import Context from './context';
import { SelectMenu, Button , Pane, Dialog, Spinner} from "evergreen-ui";
import Component from "@reactions/component";
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { Redirect } from "react-router-dom";
import { Table, Navbar } from 'react-bootstrap';
import Cookies from "universal-cookie";
import AddBoxIcon from '@material-ui/icons/AddBox';
import MaterialDatatable from "material-datatable";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import Tooltip from '@material-ui/core/Tooltip';
import load from "./load.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const cookies = new Cookies();

class Accounts extends Component {
  constructor(props) {
    super(props);
     this.wrapper = React.createRef();
    this.state = {
      spindevice: true,
      name1: '',
      check: '',
      data1: [],
      name: '',
      id: '',
      spin:false,
      show:false,
      accountData:[],
      dataLength:'',
    }

  }

  getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MuiPaper: {
        elevation4: {
          width: "100%"
        }
      },
      MuiTableCell: {
        head: {

          color: '#2e6b95',
          fontSize:'15px',
          fontWeight:'700' 
        },
        root: {
          textAlign: 'center',
        
        }
      },
   
    }
  });




  componentDidMount(){
    const urlParams = new URLSearchParams(window.location.search);
   
    
    
    cookies.set("iduser",urlParams.get('id'));
    cookies.set("username",urlParams.get('nm'));

    axios({
      url: `http://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${cookies.get("token")}","fl":2,"operateAs":"${urlParams.get('nm')}"}`,
      method: "get",
      crossDomain: true,
      dataType: "jsonp",
      enctype: "application/json",
      processData: !1,
      contentType: !1,

    })

    .then(res1 => {
     
      this.setState({
       
        check: "login"
      })
    
      cookies.set("sid1",res1.data.eid);
    })
   this.getAccounts()
    
 
  }

  async getAccounts() {
    let arr = [];
    await  axios({
      url: `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_resource","propName":"rel_is_account,sys_name","propValueMask":"1,*","sortType":"sys_name"},"force":1,"flags":5,"from":0,"to":0}&sid=${cookies.get("sid1")}`,
      method: "GET",
    })
   
      .then((res) => {
        // console.log(res.data);
        
        var counter3=0;
        for (let index = 0; index < res.data.items.length; index++) {
            counter3++;
                 axios({
            url: `https://hst-api.wialon.com/wialon/ajax.html?svc=account/get_account_data&params={"itemId":${res.data.items[index].id},"type":2}&sid=${cookies.get("sid1")}`,
            method: "GET",
          })
          .then((res1) => {
          //  console.log('serv',res1.data);
           
if (res1.data.settings.personal.services.create_units!==undefined && res1.data.settings.personal.services.import_export!==undefined) {
  this.setState({ dataLength: res.data.items.length })
  let obj = {
    hash: index + 1,
    name: res.data.items[index].nm,
   id:res.data.items[index].id,
create_units:(res1.data.settings.personal.services.create_units!==undefined?(res1.data.settings.personal.services.create_units.cost):(null)),
 import_export:res1.data.settings.personal.services.import_export,
  }
  arr.push(obj);
}
          

          })
          .catch((err)=>{
              // console.log(err);
              
          })
       
        }
        this.setState({accountData:arr})
        if (counter3===res.data.items.length) {
            this.setState({ spindevice: false,check:'login'})
            this.setState({accountData:arr})
            // console.log(counter3===res.data.items.length);
            
           }
    
      })
     
        
      
    
      .catch((err) =>{
          console.log(err);
          
      })
  }

  async  closeAllUnit(){
    this.setState({spin:true})
    var counter3=0;
    for (let index = 0; index < this.state.accountData.length; index++) {
      
      await  axios({
            url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${this.state.accountData[index].id},"name":"create_units","type":1,"intervalType":0,"costTable":"-1"}}],"flags":0}&sid=${cookies.get("sid1")}`,
            method: "PUT",
          
          })
            .then(response => {
                counter3++;
                if (counter3===this.state.accountData.length) {
                    toast.success("All Units Closed");
                    this.setState({ spin: false });
                    this.componentDidMount()
                    // console.log('c',counter3);
                    // console.log('l',this.state.accountData.length);
                                       
                   }                                           
            })
        
    }
}
async  closeAllImport(){
    this.setState({spin:true})
    var counter3=0;
    for (let index = 0; index < this.state.accountData.length; index++) {
      
      await  axios({
            url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${this.state.accountData[index].id},"name":"import_export","type":1,"intervalType":0,"costTable":"-1"}}],"flags":0}&sid=${cookies.get("sid1")}`,
            method: "PUT",
          
          })
            .then(response => {
                counter3++;
                if (counter3===this.state.accountData.length) {
                    toast.success("All Import Export Closed");
                    this.setState({ spin: false });
                    this.componentDidMount()
                    // console.log('c',counter3);
                    // console.log('l',this.state.accountData.length);
                                       
                   }                                           
            })
        
    }
}

  render() {
    const columns = [
        { name: " # ", field: "hash" },
          { name: " Name  ", field: "name" },
          { name: "Create_Units", field: "create_units" },
          {name: "Import_Export" ,field:"import_export"},
       
  
        ];
    
        const options = {
          selectableRows: false,
          print: false,
          responsive: "scroll",
          rowCursorHand: true,
          sort: true,
          filter: false,
           rowsPerPageOptions:[15,30,50,100],
          download:true,
          rowHover:true,
          border:true
        };

    return (
      <Context.Consumer>
        {ctx => {
          if (this.state.check === "notlogin") {
            return  <Redirect to='/'></Redirect>;
            return <div></div>
          } else if (this.state.check === "login" && this.state.spindevice === false) {

            return (

              <div id='homediv' >
                <ToastContainer
                  position="bottom-center"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop
                  closeOnClick
                  rtl
                  pauseOnVisibilityChange
                  draggable
                  pauseOnHover
                />

                <Navbar expand="lg" id="navmai">


                  <Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('./logo.png')} style={{ height: 30 }} alt='img' /> </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
                  <Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

                    <div id='itemnav' >
                      {cookies.get("name")}

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


                <div ref={this.wrapper}   style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '100%'
                }} >
                <div   style={{
                  display: 'flex',  alignItems: 'center', justifyContent: 'space-around',
                  width: '100%',margin:'3%'
                }}  >
<button onClick={()=>{
 
  this.setState({check:'login',show:true})
}} >Update Data</button>
<button  onClick={()=>{
    this.closeAllUnit()
}} >Close All Unit</button>
<button  onClick={()=>{
    this.closeAllImport()
}} >Close All Import Exports</button>
   {this.state.spin===true ? (
                            <div
                              style={{
                                width: "90%",
                                position: "absolute",
                             
                              }}>
                              <Lottie
                                options={{
                                  animationData: load
                                }}
                                width={300}
                                height={100}
                                position="absolute"
                              />
                            </div>
                          ) : null}
                          </div>
                          {this.state.dataLength}
               <Table striped bordered hover responsive ref={this.wrapper} >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Account_Name</th>

                        <th> Create_units </th>
                        <th> import_export</th>



                      
                       
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.accountData.map((item, i) =>
                        <tr key={i} >
                          <td> {item.hash} </td>
                          <td>{item.name}</td>
<td>
  {item.create_units !== undefined?(
             <Component initialState={{ isShown: true, spin: false }}>
                  {({ state, setState }) =>
                    state.spin ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >  <Spinner size={16} /></div>
                    ) : item.create_units === "" ? (
                      <DoneIcon
                        style={{
                          color: "#5bb061",
                          fontSize: 30,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setState({ spin: true });
                         
                          axios({
                            url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${item.id},"name":"create_units","type":1,"intervalType":0,"costTable":"-1"}}],"flags":0}&sid=${cookies.get("sid1")}`,
                            method: "PUT",                          
                          })
                            .then(response => {                          
                                // toast.success("User enabled successfully");
                                setState({ spin: false });
                                this.getAccounts();                             
                            })
                                                  
                        }}
                      />
                    ) : (
                          <CloseIcon
                            style={{
                              color: "rgb(169, 16, 16)",
                              fontSize: 30,
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              setState({ spin: true });

                              axios({
                                url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${item.id},"name":"create_units","type":1,"intervalType":0,"costTable":""}}],"flags":0}&sid=${cookies.get("sid1")}`,
                                method: "PUT",
                              
                              })
                                .then(response => {
                              
                                    // toast.success("User enabled successfully");
                                    setState({ spin: false });
                                    this.getAccounts();
                                  
                                })                            
                            }}
                          />
                        ) }
                </Component>
                ):(null)}
</td>

<td>
  {item.import_export !== undefined ?( 
<Component initialState={{ isShown: true, spin: false }}>
                  {({ state, setState }) =>
                    state.spin ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >  <Spinner size={16} /></div>
                    ) : item.import_export.cost === "" ? (
                      <DoneIcon
                        style={{
                          color: "#5bb061",
                          fontSize: 30,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setState({ spin: true });
                          var headers = {
                            jwt: cookies.get("token")
                          };
                          axios({
                            url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${item.id},"name":"import_export","type":1,"intervalType":0,"costTable":"-1"}}],"flags":0}&sid=${cookies.get("sid1")}`,
                            method: "PUT",
                          
                          })
                            .then(response => {
                          
                                // toast.success("User enabled successfully");
                                setState({ spin: false });
                                this.getAccounts();
                              
                            })                  
                        }}
                      />
                    ) : (
                          <CloseIcon
                            style={{
                              color: "rgb(169, 16, 16)",
                              fontSize: 30,
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              setState({ spin: true });

                              axios({
                                url:`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"account/update_billing_service","params":{"itemId":${item.id},"name":"import_export","type":1,"intervalType":0,"costTable":""}}],"flags":0}&sid=${cookies.get("sid1")}`,
                                method: "PUT",
                              
                              })
                                .then(response => {
                              
                                    // toast.success("User enabled successfully");
                                    setState({ spin: false });
                                    this.getAccounts();
                                  
                                })                                      
                            }}
                          />
                        ) }
                </Component>

):(null)}
</td>
                  

                    
                         
                        </tr>

                      )}

                    </tbody>
                  </Table>
{/* ):(null)}  */}

{/* 
<MuiThemeProvider theme={this.getMuiTheme()}>
        <MaterialDatatable  data={this.state.accountData} columns={columns} options={options} />
      </MuiThemeProvider> */}


                </div>
              </div>




            )
          }

          else if (this.state.check === "" || this.state.spindevice !== false) {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: '90vh'
                }}
              >
                <Lottie
                  options={{
                    animationData: animation
                  }}

                  height={250}
                />
              </div>
            );
          }


        }}
      </Context.Consumer>
    );





  }
}
export default Accounts;
