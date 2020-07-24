import React from 'react';
import '../assets/css/task.css';
import Context from './context';
import {  Spinner } from "evergreen-ui";
import Component from "@reactions/component";
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { Redirect } from "react-router-dom";
import { Table, Navbar } from 'react-bootstrap';
import Cookies from "universal-cookie";
import { createMuiTheme } from '@material-ui/core/styles';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import Tooltip from '@material-ui/core/Tooltip';
import load from "./load.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import $ from "min-jquery";
import moment from 'moment';
import RangePicker from "react-range-picker";
const cookies = new Cookies();

class Units extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      spindevice: true,
      name1: '',
      check: '',
      datass: [],
     test:`>=${moment(moment().format('L')).format("X")}`,
      spin: false,
      show: false,
     
      date1: moment(moment().format('L')).format("X") ,
      date2: 0,
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
            fontSize: '15px',
            fontWeight: '700'
          },
          root: {
            textAlign: 'center',

          }
        },

      }
    });

    allTime() {
        var x = document.getElementById("date_btn");
        x.style.backgroundColor = "#fff";
        x.style.color = "#828282";
        var b = document.getElementById("date_btn2");
        b.style.backgroundColor = "#fff";
        b.style.color = "#828282";
        var n = document.getElementById("date_btn3");
        n.style.backgroundColor = "#fff";
        n.style.color = "#828282";
        // var y = document.getElementById("date_btn1");
        // y.style.backgroundColor = "rgb(106, 170, 104)";
        // y.style.color = "#fff";
      }
    
      today() {
        // var x = document.getElementById("date_btn1");
        // x.style.backgroundColor = "#fff";
        // x.style.color = "#828282";
        var s = document.getElementById("date_btn3");
        s.style.backgroundColor = "#fff";
        s.style.color = "#828282";
        var t = document.getElementById("date_btn2");
        t.style.backgroundColor = "#fff";
        t.style.color = "#828282";
        var y = document.getElementById("date_btn");
        y.style.backgroundColor = "rgb(106, 170, 104)";
        y.style.color = "#fff";
      }
      yesterday() {
        // var x = document.getElementById("date_btn1");
        // x.style.backgroundColor = "#fff";
        // x.style.color = "#828282";
        var s = document.getElementById("date_btn3");
        s.style.backgroundColor = "#fff";
        s.style.color = "#828282";
        var t = document.getElementById("date_btn");
        t.style.backgroundColor = "#fff";
        t.style.color = "#828282";
        var y = document.getElementById("date_btn2");
        y.style.backgroundColor = "rgb(106, 170, 104)";
        y.style.color = "#fff";
      }
      Week() {
        // var x = document.getElementById("date_btn1");
        // x.style.backgroundColor = "#fff";
        // x.style.color = "#828282";
        var t = document.getElementById("date_btn");
        t.style.backgroundColor = "#fff";
        t.style.color = "#828282";
        var d = document.getElementById("date_btn2");
        d.style.backgroundColor = "#fff";
        d.style.color = "#828282";
        var y = document.getElementById("date_btn3");
        y.style.backgroundColor = "rgb(106, 170, 104)";
        y.style.color = "#fff";
      }
      onDateChanges = (date, date2) => {
        this.setState({ test:`>=${moment(date).format("X")},<=${moment(date2).add(1, 'day').format("X")}` , date2: moment(date2).format("X")  })
        var x = document.getElementById("date_btn");
        x.style.backgroundColor = "#fff";
        x.style.color = "#828282";
        // var x = document.getElementById("date_btn1");
        // x.style.backgroundColor = "#fff";
        // x.style.color = "#828282";
        var s = document.getElementById("date_btn2");
        s.style.backgroundColor = "#fff";
        s.style.color = "#828282";
        var c = document.getElementById("date_btn3");
        c.style.backgroundColor = "#fff";
        c.style.color = "#828282";
      }


  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);

    $.ajax({
        type: "GET",
        enctype: "application/json",
        processData: !1,
        contentType: !1,
        crossDomain: true,
        dataType: "jsonp",
        url: `http://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${cookies.get("token")}","fl":2,"operateAs":"${urlParams.get('nm')}"}`,
        success: function (result) {
  
  
            cookies.set("sid1",result.eid);
            if (cookies.get("sid1")) {
                this.getUnits()
              }
        }.bind(this),
        error: function (error) {
          console.log('Error from response: ' + JSON.stringify(error))
        }
      })

    cookies.set("iduser", urlParams.get('id'));
    cookies.set("username", urlParams.get('nm'));

  


  }
 
  async getUnits() {

    await $.ajax({
      type: "GET",
      enctype: "application/json",
      processData: !1,
      contentType: !1,
      crossDomain: true,
      dataType: "jsonp",
      url: `https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"core/search_items","params":{"spec":{"itemsType":"avl_unit","propName":"rel_creation_time,rel_creation_time","propValueMask":"${this.state.test}","sortType":"rel_creation_time"},"force":1,"flags":1439,"from":0,"to":0}}],"flags":512}&sid=${cookies.get("sid1")}`,
      success: function (result) {


        // this.setState({ data: result[0].items })
     
       console.log(result[0].items,result);
              

          var arr=[];
        for (let index = 0; index < result[0].items.length; index++) {
          if (result[0].items[index].pos !== null) {
            $.ajax({
              type: "GET",
              enctype: "application/json",
              processData: !1,
              contentType: !1,
              crossDomain: true,
              dataType: "jsonp",
              url: `https://geocode-maps.wialon.com/hst-api.wialon.com/gis_geocode?coords=[{"lon":${result[0].items[index].pos.x},"lat":${result[0].items[index].pos.y}}]&flags=1255211008&uid=${cookies.get("iduser")}&sid=${cookies.get("sid1")}`,
              success: function (res) {
                  // console.log(res[0]);
                
                  let obj = {
                     
                      name: result[0].items[index].nm,
                      date: result[0].items[index].ct,
                      location:res[0]                             
                    }
                    arr.push(obj)
                    this.setState({datass:arr})
              }.bind(this),
              
          })
      
          }else{
            let obj = {
                     
              name: result[0].items[index].nm,
              date: result[0].items[index].ct,
                                         
            }
            arr.push(obj)
            this.setState({datass:arr})
          }
            
        }
         this.setState({datass:arr})

        this.setState({  spindevice: false, check: 'login' })
        // this.setState({ accountData: arr })
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
                      {cookies.get("username")}

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


                <div id='searchdiv' >
                    
                        <div style={{ display: 'flex', marginLeft: '10%' }}  >
                          <RangePicker onDateSelected={this.onDateChanges}
                            selectTime={true}
                            onClose={() => {
                              this.getUnits();
                            }} />

                          {/* <div onClick={() => {
                            this.setState({ test: `<=${moment(moment().format('L')).format("X")}`, date2: 0 })
                            setTimeout(() => {
                              this.getUnits();
                              this.allTime();
                            }, 200);
                          }} id="date_btn1" > All Time </div> */}

                          <div onClick={() => {
                            this.setState({ test: `>=${moment(moment().format('L')).subtract(7, 'day').format("X")}` , date2: 0 })
                            setTimeout(() => {
                              this.getUnits();
                              this.Week();
                            }, 200);
                            // console.log(moment().subtract(7, 'day'));

                          }} id="date_btn3" > Week  </div>

                          <div onClick={() => {
                            this.setState({ test: `>=${moment(moment().format('L')).subtract(1, 'day').format("X")},<${moment(moment().format('L')).format("X")}` , date2: moment(moment().format('L')).format("X")  })
                            setTimeout(() => {
                              this.getUnits();
                              this.yesterday();
                            }, 200);
                          }} id="date_btn2" > Yesterday  </div>

                          <div onClick={() => {
                            this.setState({ date1: moment(moment().format('L')).format("X") , date2: 0,test:`>=${moment(moment().format('L')).format("X")}` })
                            setTimeout(() => {
                              this.getUnits();
                              this.today();
                            }, 200);
                          }} id="date_btn" > Today  </div>

                        </div>
                      </div>

                   
                <div>
          
                <Table striped bordered hover responsive ref={this.wrapper} >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Unit_Name</th>

                        <th> Date </th>
                        <th> Location</th>
                      </tr>
                    </thead>
                    <tbody>
                   
                    {this.state.datass.map((item, i) =>
                        <tr key={i} >
                          <td> {i + 1} </td>
                    <td> {item.name} </td>
                          <td>  {moment(item.date*1000).format('lll')} </td>
                          <td>{item.location} </td>
                          </tr>
                    )}
                        </tbody>
                        </Table>
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
export default Units;
