import React,{Component} from 'react';
import {  Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MaterialDatatable from "material-datatable";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
const cookies = new Cookies();
class Failed extends Component{
    constructor(props) {
        super(props);
        this.state = {
        data1:[],
        data:[],
        }
       
      }
      getMuiTheme = () =>
      createMuiTheme({
        overrides: {
          MuiPaper: {
            elevation4: {
              width: "90%"
            }
          }
        }
      });

    componentDidMount(){
        var storedNames = JSON.parse(localStorage.getItem("employees"));
      this.setState({data1:storedNames})
        // console.log('storedNames',storedNames);
        setTimeout(() => {
       
            
            let arr = [];
            for (let index = 0; index < this.state.data1.length; index++) {
              let obj = {
                
                name: this.state.data1[index].name,
                error: this.state.data1[index].error,
                imei:this.state.data1[index].imei,
             
            };
            arr.push(obj);
          }
          this.setState({
            data: arr
          });







        }, 400);
       
    }



    render(){
      
        const columns = [
     
          { name: " Name  ", field: "name" },
          { name: " IMEI  ", field: "imei" },
        
          { name: " Error ", field: "error" },
        ];

        const options = {
            selectableRows: false,
            print: false,
            responsive: "scroll",
            rowCursorHand: false,
            sort: false,
            filter: false,
             rowsPerPageOptions:[5,10,50,100],
            download:true,
            textLabels: {
              body: {
                noMatch: " لم يتم العثور على سجلات مطابقة",
                toolTip: "فرز"
              },
              pagination: {
                next: " next",
                previous: " previous",
                rowsPerPage: " rowsPerPage",
                displayRows: "From"
              },
              toolbar: {
                search: "search",
                downloadCsv: "downloadCsv",
                print: "Print",
                viewColumns: " التحكم بالاعمدة",
                filterTable: "فلتر"
              },
              filter: {
                all: "الكل",
                title: "فلتر",
                reset: "إعادة تعيين"
              },
              viewColumns: {
                title: "عرض الأعمدة",
                titleAria: "إظهار / إخفاء أعمدة الجدول"
              }
            }
          };
      


        return(
            <div id="my-node"   >

<Navbar expand="lg" id="navmai">


<Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('../assets/img/logo.png')} style={{ height: 30 }} alt='img' /> </Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
<Navbar.Collapse id="basic-navbar-nav" style={{ color: 'white' }} >

  <div id='itemnav' >


    <div id='teamnav'>
     
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
<Link to ={`/User?id=${cookies.get('iduser')}&nm=${cookies.get('username')}`}>
<div style={{width:'20%',textAlign:'center',marginTop:'2%',cursor:'pointer'}}  >

    <KeyboardReturnIcon style={{color:'#901101',boxShadow:'1px 1px 3px gray',fontSize:'30px'}}  />
    </div></Link>
  

<div  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div id='txtf'  >Failed To Add Units</div>
   
</div>
<div  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2%'}} >
<MuiThemeProvider theme={this.getMuiTheme()}>
                  <MaterialDatatable
                    data={this.state.data}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
                </div>
             
            </div>
        );
        }
    
}
export default Failed;