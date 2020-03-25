import React from 'react';
import './task.css';
import { Link } from 'react-router-dom';
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
import Select from 'react-select';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Component from "@reactions/component";

const cookies = new Cookies();

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? '#ffbf41e0' : 'blue',

  }),
  control: () => ({

    borderRadius: '4px',
    boxShadow: ' 0px 0px 1px 2px #b4b1b1',
    border: 'none',
    height: '33px',
    direction: 'rtl',
    textAlign: 'center',
    display: 'flex',
    width: '50%',

  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}
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
      spindevice:true,
      check: '',
      sto: '',
      imei: [],
      kitch: [],
      allid: '',
      km: ''
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
  }

  handleChange1(e) {
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
        console.log('ddd', JSON.stringify(this.state.data.length, null, 2));
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
    this.handleChange1(e);
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
      return (toast.warning(`The name is short`));
    }
    else if (this.state.sto.length == 0) {
      return (toast.error(` select device type first`));
    }
    else if (item.name.length > 3) {
      let url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={
		"creatorId":${cookies.get("id")},
		"name":"${item.name}",
		"hwTypeId":${this.state.sto},
		"dataFlags":1}
&sid=${cookies.get("sid")}`
      console.log(url);

      axios.post(url)


        .then(res1 => {
          console.log('id', res1.data.item.id);
          console.log('counter', item.km);
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${res1.data.item.id},"newValue":${item.km}}&sid=${cookies.get("sid")}`)
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x503"}&sid=${cookies.get("sid")}`)
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${res1.data.item.id},"deviceTypeId":${this.state.sto},"uniqueId":${item.uniqueId}}&sid=${cookies.get("sid")}`)
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


          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_custom_field&params={"itemId":${res1.data.item.id},"n":"Report","v":"${item.R_Value}","callMode":"create","id":1}&sid=${cookies.get("sid")}`)

          if (item.VIN != undefined) {
            axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${res1.data.item.id},"n":"vin","v":"${item.VIN}"}&sid=${cookies.get("sid")}`)
          }

          toast.success("Unit added successfully ");
        })

        .catch(err => {
          console.log('error:', err);

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
        this.get_hwdevices();


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

  get_hwdevices() {

    axios
      .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/get_hw_types&params={"filterType":"name"}&sid=${cookies.get("sid")}`, {
        headers: {
          Accept: "application/json"
        }
      })
      .then(res => {
        this.setState({
          imei: res.data,
          spindevice: false
        });
        console.log("imie", this.state.imei);
        let arr = [];
        for (let index = 0; index < this.state.imei.length; index++) {
          let obj = {
            value: this.state.imei[index].id,
            label: this.state.imei[index].name
          };
          arr.push(obj);
        }
        this.setState({
          kitch: arr
        });
      })
      .catch(err => {
        this.setState({ spindevice: false })
        console.log("error:", err);
      });
  }


  addmulty() {
    console.log(this.state.mapdata.length);
    if (this.state.sto.length == 0) {
      return (toast.error(` select device type first`));
    }
    else {


      for (var i = 0; i < this.state.mapdata.length; i++) {

        let R_Value = this.state.mapdata[i].R_Value;
        let VIN = this.state.mapdata[i].VIN
        let km = this.state.mapdata[i].km;
        let imei = this.state.mapdata[i].uniqueId;
        console.log('i1', i);
        let url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={
       "creatorId":${cookies.get("id")},
        "name":"${this.state.mapdata[i].name}",
        "hwTypeId":${this.state.sto},
        "dataFlags":1}
    &sid=${cookies.get("sid")}`

        axios.post(url)
          .then(res1 => {
            console.log('id', res1.data.item.id);
            axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x503"}&sid=${cookies.get("sid")}`)
            this.addkm(km, res1.data.item.id)
            this.addiemi(imei, res1.data.item.id)
            this.addR_value(R_Value, res1.data.item.id)
            this.addVIN(VIN, res1.data.item.id)
            toast.success("Unit added successfully ");

          })

          .catch(err => {
            console.log('error:', err);

          })

      }
    }

  }





  addiemi(data, id) {
    console.log('data addimei', data);
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${id},"deviceTypeId":${this.state.sto},"uniqueId":${data}}&sid=${cookies.get("sid")}`)
      .then(res1 => {
        console.log(res1.data);
        if (res1.data.error === 1002) {
          toast.warning('Item with such unique property already exists')
        }
        else if (res1.data.error === 4) {
          toast.warning(' Add the unique_id')
        }
      })
      .catch(err => {
        console.log('err', err);
      })

  }

  addR_value(data, id) {
    console.log('data rvalue', data);
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_custom_field&params={"itemId":${id},"n":"Report","v":"${data}","callMode":"create","id":1}&sid=${cookies.get("sid")}`)
      .then(res1 => {
        console.log(res1.data);
      })
      .catch(err => {
        console.log('err', err);
      })

  }

  addVIN(data, id) {
    if (data != undefined) {
      console.log('data rvalue', data);
      axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${id},"n":"vin","v":"${data}"}&sid=${cookies.get("sid")}`)
        .then(res1 => {
          console.log(res1.data);
        })
        .catch(err => {
          console.log('err', err);
        })
    }
  }

  addkm(data, id) {
    console.log('data addkm', data);
    console.log('itemid', this.state.allid);

    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${id},"newValue":${data}}&sid=${cookies.get("sid")}`)
      .then(res1 => {
        console.log(res1.data);
      })
      .catch(err => {
        console.log('err', err);
      })

  }


  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };


  render() {

    const { selectedOption } = this.state;
    return (
      <Context.Consumer>
        {ctx => {
          if (this.state.check === "notlogin") {
            return <Redirect to="/"></Redirect>;
          } else if (this.state.check === "login" && this.state.spindevice === false  ) {

            return (

              <div id="homediv" >
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

                <div id='maintbldiv'>
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

                    <Link id='temfile' to={require('./test1.xlsx')} target="_blank" download>Download a template <GetAppIcon /> </Link>





                  </div>
                </div>

                {this.state.spinitem === false ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                    }}>

                  </div>
                ) : (<div id='maintbldiv' >  <div id='tbldiv'>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2%' }} >

                    <div id="d_type" >Device Type :</div>
                    <Select

                      onChange={e => {
                        this.setState({ sto: e.value });
                        //  this.setState({ spin:true });
                        console.log('sto', e.value);

                      }}
                      value={selectedOption}
                      styles={customStyles}
                      options={this.state.kitch}
                    />

                    <div id='albtndiv'>
                      <div id='addall' onClick={() => {
                        this.addmulty()
                      }} >Add all {this.state.mapdata.length} unit</div>
                    </div>



                  </div>

                  <Table striped bordered hover responsive >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Unit_Name</th>

                        <th> IMEI </th>
                        <th> Mileage</th>



                        <th> Report_Value</th>
                        <th> VIN_Number</th>
                        <th> Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.mapdata.map((item, i) =>
                        <tr key={i} >
                          <td>{item.num}</td>
                          <td>{item.name}</td>

                          <td>{item.uniqueId}</td>
                          <td>{item.km}</td>


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




                </div>
                </div>)}




<button onClick={()=>{
 
}} >cler</button>



              </div>




            )
          }

          else if (this.state.check === "" || this.state.spindevice !== false ) {
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
