import React from 'react';
import '../assets/css/task.css';
import { Link } from 'react-router-dom';
import Context from './context';
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
import $ from "min-jquery";
import Select from 'react-select';
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
class Tags extends Component {
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
      spinone:false,
      check: '',
      sto: '',
      sto1: '',
      imei: [],
      user: [],
      kitch: [],
      kitch1: [],
      allid: '',
      km: '',
      err1: '',
      nmuser: '',
      spinall:false,
      fruits: [],
      source_id:''
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


  checkimei(item) {
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_unique_id","propValueMask":"${item.uniqueId}","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=${cookies.get("sid1")}`)
      .then(res1 => {

        // console.log('emie', res1.data.items.length);
        if (this.state.sto.length === 0) {
          return (
            this.setState({spinone:false}),
            toast.error(` select device type first`));
        }
        if (res1.data.items.length > 0) {

          return (
            this.setState({spinone:false}),
            toast.warning('Item with such unique property already exists'));
        }
        if (res1.data.items.length <= 0) {
          return (this.add(item));

        }
        // console.log('state', this.state.err1);

      })
      .catch(err => {
        // console.log('error:', err);
      })
  }



  add(item) {
  
    if (item.name.length <= 3) {
      return (
        this.setState({spinone:false}),
        toast.warning(`The name is short`));
    }
  

    let url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={
          "creatorId":${cookies.get("iduser")},
          "name":"${item.name}",
          "hwTypeId":${this.state.sto},
          "dataFlags":1}
      &sid=${cookies.get("sid1")}`
   

    axios.post(url)
      .then(res1 => {
       
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${res1.data.item.id},"newValue":${item.km}}&sid=${cookies.get("sid1")}`)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x513"}&sid=${cookies.get("sid1")}`)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"item/update_custom_property","params":{"itemId":${res1.data.item.id},"name":"img_rot","value":1}}],"flags":0}&sid=${cookies.get("sid1")}`);
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${res1.data.item.id},"deviceTypeId":${this.state.sto},"uniqueId":${item.uniqueId}}&sid=${cookies.get("sid1")}`)
          .then(res1 => {

       
            if (res1.data.error === 1002) {
              this.setState({ err1: true })

            }
            else if (res1.data.error === 4) {
              toast.warning(' Add the unique_id')
            }
          })
          .catch(err => {
            // console.log('error:' + err.response);
          })


        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_admin_field&params={"itemId":${res1.data.item.id},"n":"Report","v":"${item.R_Value}","callMode":"create","id":1}&sid=${cookies.get("sid1")}`)

        if (item.VIN !== undefined) {
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${res1.data.item.id},"n":"vin","v":"${item.VIN}"}&sid=${cookies.get("sid1")}`)
        }

        toast.success("Unit added successfully ");
        this.setState({spinone:false})
      })

      .catch(err => {
        // console.log('error:', err);
        this.setState({spinone:false})
      })
  }



  componentDidMount() {

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
        data1: res1.data,
        check: "login"
      })
    
      cookies.set("sid1",res1.data.eid);
   
      this.get_hwdevices();

    })
      .catch(err => {
        // console.log('error:' + err);
        this.setState({
          check: "notlogin"
        });
      })
    setInterval(() => {
      axios.post('https://sdk.wialon.com/wiki/en/sidebar/remoteapi/apiref/requests/avl_evts')
    }, 20000);

    axios({
        url: `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_resource","propName":"drivers","propValueMask":"*","sortType":"drivers","propType":"property"},"force":0,"flags":33037,"from":0,"to":0}&sid=${cookies.get("sid1")}`,
        method: "post",
        crossDomain: true,
        dataType: "jsonp",
        enctype: "application/json",
      })
  
        .then(res1 => {
          console.log('res', res1.data.items[2].id);
          this.setState({ source_id: res1.data.items[2].id })
  
        })
        .catch(err => {
          // console.log('error:' + err);
        })
  }

  get_users() {
    let getIndex = this.state.kitch1.findIndex((element) => element.label === cookies.get("name"))


    this.setState({ nmuser: this.state.kitch1[getIndex] })
    axios
      .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={ "spec":{"itemsType": "user","propName": "sys_name","propValueMask": "*","sortType": "sys_name","propType": "property"},"force": 0,"flags": 5,"from": 0,"to":0}&sid=${cookies.get("sid1")}`, {
        headers: {
          Accept: "application/json"
        }
      })
      .then(res => {
        this.setState({
          user: res.data.items,

        });
     
        let arr = [];
        for (let index = 0; index < this.state.user.length; index++) {
          let obj = {
            value: this.state.user[index].id,
            label:(<div style={{width:'100%',display:'flex',justifyContent:'space-between'}}  onClick={()=>{
              console.log('ids',this.state.user[index].id);
              window.location.href =`/User?id=${this.state.user[index].id}&nm=${this.state.user[index].nm}`;
            }}  >
               {this.state.user[index].nm}
             </div>
                )
          };
          arr.push(obj);
        }
        this.setState({
          kitch1: arr
        });
      })
      .catch(err => {

        // console.log("error:", err);
      });
  }






  get_hwdevices() {

    axios
      .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/get_hw_types&params={"filterType":"name"}&sid=${cookies.get("sid1")}`, {
        headers: {
          Accept: "application/json"
        }
      })
      .then(res => {
        this.setState({
          imei: res.data,
          spindevice: false
        });
      
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
        // console.log("error:", err);
      });
  }



  getcheckmultyimei = async () => {
 
  
     
    
    var counter3 = 0;
    for (let index = 0; index < this.state.mapdata.length; index++) {
     
      await $.ajax({
        type: "PUT",
        enctype: "application/json",
        processData: !1,
        contentType: !1,
        crossDomain: true,
        dataType: "jsonp",
        url: `https://hst-api.wialon.com/wialon/ajax.html?svc=resource/update_driver&params={"itemId":${this.state.source_id},"id":0,"callMode":"create","n":"${this.state.mapdata[index].Name}","p":"","c":"${this.state.mapdata[index].Code}","ds":""}&sid=${cookies.get("sid1")}`,
        success: function (result) {
          counter3++;
          console.log(counter3,this.state.mapdata.length);
          
          if (counter3 === this.state.mapdata.length) {
            toast.success("done");
            this.setState({ spinall: false });
           
          }
        }.bind(this),

      })
    }


  

         
     
};

onSubmit(){
  window.location.href='/Failed'
//  return(<Redirect to='/Failed' />) 
}

  async addiemi(data, id) {
    // console.log('data addimei', data);
    try {
     await axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${id},"deviceTypeId":${this.state.sto},"uniqueId":${data}}&sid=${cookies.get("sid1")}`)
    // let { data1 } = res.data;
       
    }
        catch (error) {
          // console.log(error);
        }
    

  }

  addR_value(data, id) {
    // console.log('data rvalue', data);
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_admin_field&params={"itemId":${id},"n":"Report","v":"${data}","callMode":"create","id":1}&sid=${cookies.get("sid1")}`)
      .then(res1 => {
      
      })
      .catch(err => {
        // console.log('err', err);
      })

  }

  addVIN(data, id) {
    if (data !== undefined) {
      console.log('data rvalue', data);
      axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${id},"n":"vin","v":"${data}"}&sid=${cookies.get("sid1")}`)
        .then(res1 => {
         
        })
        .catch(err => {
          // console.log('err', err);
        })
    }
  }

  addkm(data, id) {
   

    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${id},"newValue":${data}}&sid=${cookies.get("sid1")}`)
      .then(res1 => {
     
      })
      .catch(err => {
        // console.log('err', err);
      })

  }


  handleChange = selectedOption => {
    this.setState({ selectedOption });
    // console.log(`Option selected:`, selectedOption);
  };


  render() {

    const { selectedOption } = this.state;
    return (
      <Context.Consumer>
        {ctx => {
          if (this.state.check === "notlogin") {
            return  <Redirect to='/'></Redirect>;;
          } else if (this.state.check === "login" && this.state.spindevice === false) {

            return (

              <div  >
                <ToastContainer
                  position="bottom-center"
            
                  autoClose={false}
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
                        {/* <i className="fas fa-sign-out-alt"></i> */}

                        <div>{cookies.get("username")} </div>
                     
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
                    {this.state.spinone===true ? (
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
                    {this.state.spinall===true ? (
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
                        this.setState({spinall:true})
                        this.getcheckmultyimei()
                      }} >Add all {this.state.mapdata.length} unit</div>
                    </div>



                  </div>
              
            
                  <Table striped bordered hover responsive >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>

                        <th> Code </th>
                     
                        <th> Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.mapdata.map((item, i) =>
                        <tr key={i} >
                          <td>{item.num}</td>
                          <td>{item.Name}</td>

                          <td>{item.Code}</td>
                        
                          <td>

                            <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => {
                              this.checkimei(item)
                              this.setState({spinone:true})

                            }}> <AddBoxIcon id='btntbladd' />  </div>


                          </td>
                        </tr>

                      )}

                    </tbody>
                  </Table>
             



                </div>
                </div>)}







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
export default Tags;
