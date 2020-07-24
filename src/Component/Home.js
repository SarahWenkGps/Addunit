import React from 'react';
import '../assets/css/task.css';
import { Link  } from 'react-router-dom';
import Context from './context';
import { Pane, Dialog ,SelectMenu,Button} from "evergreen-ui";
import Component from "@reactions/component";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Redirect } from "react-router-dom";
import { Table, Navbar } from 'react-bootstrap';

import Cookies from "universal-cookie";
import axios from 'axios';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import load from "./load.json";
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import Tooltip from '@material-ui/core/Tooltip';
import XLSX from 'xlsx';
import Select from 'react-select';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const cookies = new Cookies();

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? '#ffbf41e0' : 'blue',
    width: '100%'
  }),
  control: () => ({

    borderRadius: '4px',
    boxShadow: ' 0px 0px 1px 2px #b4b1b1',
    border: 'none',
    height: '33px',
    direction: 'rtl',
    textAlign: 'center',
    display: 'flex',
    width: '100%',

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
      spindevice: true,
      selectspin: false,
      spinone: false,
      check: '',
      sto: '',
      sto1: '',
      fruits: [],
      imei: [],
      user: [],
      kitch: [],
      kitch1: [],
      allid: '',
      km: '',
      err1: '',
      nmuser: '',
      spinall: false,

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

  onSubmit(){
    window.location.href='/Faild'
    
  }

  checkimei(item) {
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_unique_id","propValueMask":"${item.uniqueId}","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=${cookies.get("sid")}`)
      .then(res1 => {

        console.log('emie', res1.data.items.length);
        if (this.state.sto.length == 0) {
          return (
            this.setState({ spinone: false }),
            toast.error(` select device type first`));
        }
        if (res1.data.items.length > 0) {

          return (
            this.setState({ spinone: false }),
            toast.warning('Item with such unique property already exists'));
        }
        if (res1.data.items.length <= 0) {
          return (this.add(item));

        }
        console.log('state', this.state.err1);

      })
      .catch(err => {
        console.log('error:', err);
      })
  }



  add(item) {
    console.log(item.name);
    console.log(item.type);
    console.log(cookies.get('sid'));
    console.log(cookies.get('id'));
    if (item.name.length <= 3) {
      return (
        this.setState({ spinone: false }),
        toast.warning(`The name is short`));
    }


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
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x513"}&sid=${cookies.get("sid")}`)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${res1.data.item.id},"deviceTypeId":${this.state.sto},"uniqueId":${item.uniqueId}}&sid=${cookies.get("sid")}`)
          .then(res1 => {

            console.log('emie', res1.data.error);
            if (res1.data.error === 1002) {
              this.setState({ err1: true })

            }
            else if (res1.data.error === 4) {
              toast.warning(' Add the unique_id')
            }
          })
          .catch(err => {
            console.log('error:' + err.response);
          })


        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_admin_field&params={"itemId":${res1.data.item.id},"n":"Report","v":"${item.R_Value}","callMode":"create","id":1}&sid=${cookies.get("sid")}`)

        if (item.VIN != undefined) {
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${res1.data.item.id},"n":"vin","v":"${item.VIN}"}&sid=${cookies.get("sid")}`)
        }

        toast.success("Unit added successfully ");
        this.setState({ spinone: false })
      })

      .catch(err => {
        console.log('error:', err);
        this.setState({ spinone: false })
      })
  }



  componentDidMount() {

   if (cookies.get("token")){
this.setState({ check: "login"})
   }
   else{
    this.setState({check: "notlogin"})
   }
        this.get_hwdevices();
        this.get_users();



  }

  get_users() {
  
    axios
      .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={ "spec":{"itemsType": "user","propName": "sys_name","propValueMask": "*","sortType": "sys_name","propType": "property"},"force": 0,"flags": 5,"from": 0,"to":0}&sid=${cookies.get("sid")}`, {
        headers: {
          Accept: "application/json"
        }
      })
      .then(res => {
        this.setState({
          user: res.data.items,
         
        });
        console.log("imie", this.state.user);
        let arr = [];
        for (let index = 0; index < this.state.user.length; index++) {
          let obj = {
            value: this.state.user[index].id,
            label:this.state.user[index].nm
           
            
          };
          arr.push(obj);
        }
        this.setState({
          kitch1: arr
        });
      })
      .catch(err => {

        console.log("error:", err);
       
      });
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



  getcheckmultyimei = async () => {
    if (this.state.sto.length == 0) {
      return (
        this.setState({ spinall: false }),
        toast.error(` select device type first`))

    }
    else {
      var succes = 0;
      var not = 0;
      var counter = 0;
      var counter3 = 0;
      for (var i = 0; i < this.state.mapdata.length; i++) {
        counter3++;

        let R_Value = this.state.mapdata[i].R_Value;
        let VIN = this.state.mapdata[i].VIN;
        let km = this.state.mapdata[i].km;
        let name = this.state.mapdata[i].name;
        let imei = this.state.mapdata[i].uniqueId;
        let lenth = i;

        try {
          if (counter3 == this.state.mapdata.length) {
            this.setState({ spinall: false })
          }
          let res = await axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_unique_id","propValueMask":"${imei}","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=${cookies.get("sid")}`);
          let { data } = res.data;
          console.log(res.data);

          if (res.data.items.length > 0) {
            not = not + 1;
            this.state.fruits.push({
              name:this.state.mapdata[i].name,
              imei:this.state.mapdata[i].uniqueId,
              km : this.state.mapdata[i].km,
              R_Value : this.state.mapdata[i].R_Value,
             VIN : this.state.mapdata[i].VIN,
              error:'uniqueId already exist',
            });
            console.log(this.state.fruits);
            localStorage.setItem("employees", JSON.stringify(this.state.fruits));
          

          }
          else if (res.data.items.length <= 0) {
            if (name.length <= 3) {
              not = not + 1;
                this.setState({ spinall: false })
                this.state.fruits.push({
                  name:this.state.mapdata[i].name,
                  imei:this.state.mapdata[i].uniqueId,
                  km : this.state.mapdata[i].km,
                  R_Value : this.state.mapdata[i].R_Value,
                 VIN : this.state.mapdata[i].VIN,
                  error:'name is short',
                });
                console.log(this.state.fruits);
                localStorage.setItem("employees", JSON.stringify(this.state.fruits));
                var storedNames = JSON.parse(localStorage.getItem("employees"));
                
            }
            let res1 = await axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={"creatorId":${cookies.get("id")},"name":"${name}","hwTypeId":${this.state.sto},"dataFlags":1}&sid=${cookies.get("sid")}`);
            let { data } = res1.data;

            console.log('res2', res1.data);

            await this.addiemi(imei, res1.data.item.id)
            await axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x513"}&sid=${cookies.get("sid")}`)
            await this.addkm(km, res1.data.item.id)
            await this.addR_value(R_Value, res1.data.item.id)
            await this.addVIN(VIN, res1.data.item.id)

            counter = counter + 1
          }

        } catch (error) {
          console.log(error);
          if (counter3 == this.state.mapdata.length) {
            this.setState({ spinall: false })
          }
        }
        console.log('counter', counter);
        console.log('counter3', counter3);
        console.log('lenth', lenth);
        console.log('i', i);
        console.log('this.state.mapdata.length', this.state.mapdata.length);
        if (counter3 == this.state.mapdata.length) {

          if (counter > 0) {
            toast.success(`Units added successfully ${counter}`)
          }

          if (this.state.mapdata.length - counter > 0) {
            toast.error(`Failed to adds ${this.state.mapdata.length - counter}`)
            return (this.onSubmit())
          }



        }
      }
    }
  };



  async addiemi(data, id) {
    console.log('data addimei', data);
    try {
      let res = await axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${id},"deviceTypeId":${this.state.sto},"uniqueId":${data}}&sid=${cookies.get("sid")}`)
      let { data1 } = res.data;
      console.log('iemi33', res.data);
  
    }
    catch (error) {
      console.log(error);
    }


  }

  addR_value(data, id) {
    console.log('data rvalue', data);
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_admin_field&params={"itemId":${id},"n":"Report","v":"${data}","callMode":"create","id":1}&sid=${cookies.get("sid")}`)
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
            return <Redirect to='/'></Redirect>
          } else if (this.state.check === "login" && this.state.spindevice === false) {

            return (

              <div  >
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


                  <Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('../assets/img/logo.png')} style={{ height: 30 }} /> </Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
                  <Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

                    <div id='itemnav' >


                      <div id='teamnav'>
                        {/* <i className="fas fa-sign-out-alt"></i> */}

                        <div> <span style={{color:'#327093',fontSize:'15px'}} >Login as : </span> <Component initialState={{ selected: cookies.get("name") }}>
                          {({ setState, state }) => (
                            <SelectMenu
                              title="Select name"
                              options={
                                this.state.kitch1
                              }
                              selected={state.selected}
                              onSelect={item => {
                                setState({ selected: item.value })
                            
                               
                                window.location.href = `/User?id=${item.value}&nm=${item.label}`;
                            
                            
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
                    <div style={{ width: '30%' }}  >
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
                    </div>
                    {this.state.spinone == true ? (
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
                    {this.state.spinall == true ? (
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

                    <div id='albtndiv'>
                      <div id='addall' onClick={() => {
                        this.setState({ spinall: true })
                        this.getcheckmultyimei()
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
                              this.checkimei(item)
                              this.setState({ spinone: true })

                            }}> <AddBoxIcon id='btntbladd' />  </div>


                          </td>
                        </tr>

                      )}

                    </tbody>
                  </Table>




                </div>
                </div>)}


                <button onClick={() => {
                  this.state.fruits.push({
                    name: 'Rushabh',
                    age: 27
                  });
                  console.log(this.state.fruits);
                  localStorage.setItem("employees", JSON.stringify(this.state.fruits));
                  var storedNames = JSON.parse(localStorage.getItem("employees"));
                

                }} >push</button>




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
export default Home;
