import React from 'react';
import './task.css';
import Context from './context';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Redirect } from "react-router-dom";
import { Table, Navbar } from 'react-bootstrap';
import Cookies from "universal-cookie";
import axios from 'axios';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import Tooltip from '@material-ui/core/Tooltip';
import XLSX from 'xlsx';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Component from "@reactions/component";

const cookies = new Cookies();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data1: [],
      password: '',
      email: '',
      name1: '',
      file: {},
      data: [],
      cols: [],
      data12: [],
      mapdata: [],
      spinitem: false,
      spinload: false,
      spinadd: false,
      check: '',
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
        console.log('ddd', JSON.stringify(this.state.data, null, 2));
      });

      this.setState({ data12: JSON.stringify(this.state.data, null, 2) })
    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };

    setTimeout(() => {
      this.setState({ spinload: true })
    }, 200);

  }










  handleFiles = (files) => {
    console.log(files)
  }
  fff(e) {
    this.handleChange(e);
    setTimeout(() => {
      this.handleFile(e);


    }, 300);


  }

  add(item) {

    console.log(item.name);
    console.log(item.type);
    console.log(cookies.get('sid'));
    console.log(cookies.get('id'));
    if (item.name.length <= 3) {
      return (toast.error(`   الاسم المدخل قصير`));
    }

    else if (item.name.length > 3) {
      let url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={
		"creatorId":${cookies.get("id")},
		"name":"${item.name}",
		"hwTypeId":${item.id},
		"dataFlags":1}
&sid=${cookies.get("sid")}`
      console.log(url);

      axios.post(url)


        .then(res1 => {
          console.log('id', res1.data.item.id);
          console.log('counter', item.km);


          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${res1.data.item.id},"newValue":${item.km}}&sid=${cookies.get("sid")}`)
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x503"}&sid=${cookies.get("sid")}`)
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${res1.data.item.id},"deviceTypeId":${item.id},"uniqueId":${item.uniqueId}}&sid=${cookies.get("sid")}`)
            .then(res1 => {

              console.log('emie', res1.data.error);
              if (res1.data.error === 1002) {
                toast.warning('Item with such unique property already exists')
              }
              else if (res1.data.error === 4) {
                toast.warning(' Add the unique_id')
              }
            })
            .catch(err => {
              console.log('error:' + err.response);
            })


          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_custom_field&params={"itemId":${res1.data.item.id},"n":"${item.Report}","v":"${item.R_Value}","callMode":"create","id":1}&sid=${cookies.get("sid")}`)
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${res1.data.item.id},"n":"vin","v":"${item.VIN}"}&sid=${cookies.get("sid")}`)



          toast.success("Unit added successfully ");


        })

        .catch(err => {
          console.log('error:', err.data);

        })

    }
  }








  componentDidMount() {

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    const name = urlParams.get('access_token');
    this.setState({ name1: name })
    console.log("name", urlParams.get('access_token'));
    cookies.set("token", name);


    axios.get(`http://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${urlParams.get('access_token')}"}`)

      .then(res1 => {

        this.setState({
          data1: res1.data,
          check: "login"
        })
        console.log('sssdd', this.state.data1);
        cookies.set("sid", this.state.data1.eid);
        cookies.set("id", this.state.data1.user.id);
      })
      .catch(err => {
        console.log('error:' + err);
        this.setState({
          check: "notlogin"
        });
      })
    setInterval(() => {
      axios.post('https://sdk.wialon.com/wiki/en/sidebar/remoteapi/apiref/requests/avl_evts')
    }, 20000);

  }
  render() {


    return (
      <Context.Consumer>
        {ctx => {
          if (this.state.check === "notlogin") {
            return <Redirect to="/"></Redirect>;
          } else if (this.state.check === "login") {

            return (

              <div id="homediv" >
                <ToastContainer
                  position="top-center"
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


                  <Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('./logo.png')} style={{ height: 30 }} /> </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
                  <Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

                    <div id='itemnav' >


                      <div id='teamnav'>
                        {/* <i className="fas fa-sign-out-alt"></i> */}

                        <div>{this.state.data1.au} </div>

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

                <div id='maindivbtn'>

                  <input type="file" className="form-control" id="file" accept={SheetJSFT}
                    //  onChange={this.handleChange} 
                    onChange={e => {
                      this.fff(e);

                    }}

                  />

                  {this.state.spinload === false ? (
                    <div>


                    </div>
                  ) : (

                      <div id='upload' onClick={() => {
                        console.log('eses', this.state.data12);
                        this.setState({
                          mapdata: JSON.parse(this.state.data12)
                        })
                        this.setState({ dtss: this.state.data12 })
                        setTimeout(() => {
                          this.setState({ spinitem: true })
                        }, 200);


                      }}>Upload</div>
                    )}
                </div>
                {/* <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}} >
                            <img src={require('./type.png')}  /> </div> */}
                {this.state.spinitem === false ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                    }}>

                  </div>
                ) : (<div id='tbldiv'>


                  <Table striped bordered hover>
                    <thead>
                      <tr>

                        <th>Unit_Name</th>
                        <th>Device_Type</th>
                        <th> EMIE</th>
                        <th> KM</th>


                        <th> Report_Name</th>
                        <th> Report_Value</th>
                        <th> VIN_Number</th>
                        <th> Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.mapdata.map((item, i) =>
                        <tr key={i} >
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>{item.uniqueId}</td>
                          <td>{item.km}</td>

                          <td>{item.Report}</td>
                          <td>{item.R_Value}</td>
                          <td>{item.VIN}</td>
                          <td>

                            <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
                              this.add(item)

                            }}> <AddBoxIcon id='btntbladd' />  </div>


                          </td>
                        </tr>

                      )}

                    </tbody>
                  </Table>





                </div>)}





              </div>




            )
          }

          else if (this.state.check === "") {
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
export default Home;
