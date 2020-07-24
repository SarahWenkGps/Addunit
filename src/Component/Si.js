import React from 'react';
import '../assets/css/task.css';
import Context from './context';
import { SelectMenu, Button } from "evergreen-ui";
import Component from "@reactions/component";
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Redirect } from "react-router-dom";
import { Navbar } from 'react-bootstrap';
import Cookies from "universal-cookie";
import axios from 'axios';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import Tooltip from '@material-ui/core/Tooltip';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "min-jquery";
const cookies = new Cookies();

class Si extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spindevice: false,
      name1: '',
      check: '',
      data1: [],
      name: '',
      id: '',

    }

  }






  async componentDidMount() {

    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('access_token');
    this.setState({ name1: name })
    cookies.set("token", name);
    var url = `https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${urlParams.get('access_token')}","fl":2}`
    await $.ajax({
      type: "POST",
      enctype: "application/json",
      processData: !1,
      contentType: !1,
      crossDomain: true,
      dataType: "jsonp",
      url: url,
      success: function (result) {
        // console.log(result);
        this.setState({
          data1: result,
          check: "login"
        })

        cookies.set("sid", this.state.data1.eid);
        cookies.set("id", this.state.data1.user.id);
        cookies.set("name", this.state.data1.user.nm);
        this.setState({
          name: this.state.data1.user.nm,
          id: this.state.data1.user.id
        })
        this.get_users();

      }.bind(this),
      error: function (error) {
        console.log('Error from response: ' + JSON.stringify(error))
      }
    })






    setInterval(() => {    
      let url = 'https://sdk.wialon.com/wiki/en/sidebar/remoteapi/apiref/requests/avl_evts'
      $.ajax({
        type: "POST",
        enctype: "application/json",
        processData: !1,
        contentType: !1,
        crossDomain: true,
        dataType: "jsonp",
        url: url,
      })

    }, 20000);


  }

 async get_users() {

    await $.ajax({
      type: "GET",
      enctype: "application/json",
      processData: !1,
      contentType: !1,
      crossDomain: true,
      dataType: "jsonp",
      url: (`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={ "spec":{"itemsType": "user","propName": "sys_name","propValueMask": "*","sortType": "sys_name","propType": "property"},"force": 0,"flags": 5,"from": 0,"to":0}&sid=${cookies.get("sid")}`),
      success: function (result) {
        // console.log(result);
        this.setState({
          user: result.items,

        });
        let arr = [];
        for (let index = 0; index < this.state.user.length; index++) {
          let obj = {
            value: this.state.user[index].id,
            label: this.state.user[index].nm


          };
          arr.push(obj);
        }
        this.setState({
          kitch1: arr
        });
      

    }.bind(this),
    error: function (error) {
      console.log('Error from response: ' + JSON.stringify(error))
    }
  })
}
   

  render() {


    return (
      <Context.Consumer>
        {ctx => {
          if (this.state.check === "notlogin") {
            return <Redirect to='/'></Redirect>;
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


                  <Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('../assets/img/logo.png')} style={{ height: 30 }} alt='img' /> </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
                  <Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

                    <div id='itemnav' >


                      <div id='teamnav'>
                        <div> <span style={{ color: '#327093', fontSize: '15px' }} >Login as : </span>
                          <Component initialState={{ selected: cookies.get("name") }}>
                            {({ setState, state }) => (
                              <SelectMenu
                                title="Select name"
                                options={
                                  this.state.kitch1
                                }
                                selected={state.selected}
                                onSelect={item => {
                                  setState({ selected: item.label })
                                  this.setState({
                                    name: item.label,
                                    id: item.value
                                  })


                                }}
                              >
                                <Button>{state.selected || 'Select name...'}</Button>
                              </SelectMenu>
                            )}
                          </Component>
                        </div>



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


                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '100%'
                }} >

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
                    width: '90%', height: '90vh'
                  }} >

                    <div id='imgexel' onClick={() => {
                      window.location.href = `/User?id=${this.state.id}&nm=${this.state.name}`;
                    }}  >
                      <div id='inimg' >Adding from Excel</div>
                      <img src={require('../assets/img/xlsx.png')} style={{ width: '150px', height: '150px' }} alt='alt' />

                    </div>


                    <div id='imgexel' onClick={() => {
                      window.location.href = `/Units?id=${this.state.id}&nm=${this.state.name}`;
                    }}  >
                      <div id='inimg' >Check Units  </div>
                      <img src={require('../assets/img/permit.png')} style={{ width: '150px', height: '150px' }} alt='alt' />

                    </div>




                    {/* <div id='imgexel' onClick={() => {
                      window.location.href = `/Tags?id=${this.state.id}&nm=${this.state.name}`;
                    }} >
                      <div id='inimg' >Adding from Template</div>
                      <img src={require('../assets/img/template.png')} style={{ width: '150px', height: '150px' }} alt='alt' />
                    </div> */}



                    <div id='imgexel' onClick={() => {
                      window.location.href = `/Accounts?id=${this.state.id}&nm=${this.state.name}`;
                    }} >
                      <div id='inimg' >Check Accounts</div>
                      <img src={require('../assets/img/security.png')} style={{ width: '150px', height: '150px' }} alt='alt' />
                    </div>



                  </div>

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
export default Si;
