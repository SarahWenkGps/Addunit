import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import {  Redirect } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import Check from './Check';
import { saveAs } from 'file-saver';
import htmlToImage from 'html-to-image';
import axios from 'axios';
import Cookies from "universal-cookie";
import Context from './context';
import Lottie from "lottie-react-web";
import animation from "./animation.json";
import Dialog from './Dialog';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const cookies = new Cookies();

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',

  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 282,
    borderBottom: '1px solid #016ba7;',
    display: 'flex'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}



const options = [
  { value: 'محمد الامين', label: 'محمد الامين' },
  { value: 'مصطفى جواد', label: 'مصطفى جواد' },
  { value: 'حيدر ', label: 'حيدر ' },
  { value: 'عمر فارس ', label: 'عمر فارس ' },
  { value: 'احمد عباس ', label: 'احمد عباس ' },
  { value: 'مصطفى خليل ', label: 'مصطفى خليل ' },
  { value: 'مصطفى حامد ', label: 'مصطفى حامد ' },
  { value: 'عمر خضير ', label: 'عمر خضير ' },
  { value: 'علي نبيل ', label: 'علي نبيل ' },
  { value: 'مدحت حمودي ', label: 'مدحت حمودي ' },
  { value: 'محمد كريم ', label: 'محمد كريم ' },
  { value: 'عدنان زامل ', label: 'عدنان زامل ' },
  { value: 'حمدي محمد ', label: 'حمدي محمد ' },
  { value: 'غيث ', label: 'غيث ' },
  { value: 'مصطفى وليد ', label: 'مصطفى وليد ' },
  { value: 'ماجد حامد ', label: 'ماجد حامد ' },
  { value: 'احمد تركي ', label: 'احمد تركي ' },
];


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data1: [],
      data: [],
      startDate2: new Date(),
      device1: [],
      device_name: '',
      uniqueId: '',
      unit_name: '',
      VIN: '',
      km: '',
      R_Value: '',
      source_id: '',
      driver_name: '',
      phone: '',
      tagid:'',
      spindevice: true,
      spanmessage:false,
      item_name:'',
      satellites:'' ,
      code:'',
    }
    this.handleChange2 = this.handleChange2.bind(this);

  }


  handleChange2(BirthDate) {
    this.setState({
      startDate2: BirthDate,
      BirthDate,

    });
  }

  componentDidMount() {

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('nm');


    cookies.set("iduser", urlParams.get('id'));
    cookies.set("username", urlParams.get('nm'));

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
       
        cookies.set("sid1", res1.data.eid);

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

  Resourceid() {
    axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=resource/update_driver&params={"itemId":${this.state.source_id},"id":0,"callMode":"create","n":"${this.state.driver_name}","p":"%2B${this.state.phone}","c":"${this.state.code}","ds":"","jp":{"Tag%20ID":"${this.state.tagid}"}}&sid=${cookies.get("sid1")}`)
      .then(res1 => {
console.log('driv',res1.data);

      

      })
      .catch(err => {
        // console.log('error:', err);
      })
  }

  checkimei() {
   
    if (this.state.uniqueId.length === 0) {
      return (
        this.setState({ spinone: false }),
        toast.error(` insert unique_id first`));
    } else {
      axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_unique_id","propValueMask":"${this.state.uniqueId}","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=${cookies.get("sid1")}`)
        .then(res1 => {

          

          if (res1.data.items.length > 0) {

            return (
              this.setState({ spinone: false }),
              toast.warning('Item with such unique property already exists'));
          }
          if (res1.data.items.length <= 0) {
            return (this.add());

          }
       

        })
        .catch(err => {
          // console.log('error:', err);
        })
    }
  }





  add() {

  
    if (this.state.unit_name.length <= 3) {
      return (
        this.setState({ spinone: false }),
        toast.warning(`The name is short`));
    }
    if (this.state.device_name.length === 0) {
      return (
        this.setState({ spinone: false }),
        toast.error(` select device type `));
    }
    if (this.state.R_Value.length === 0) {
      return (
        this.setState({ spinone: false }),
        toast.error(` Add Report Number`));
    }

    let url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/create_unit&params={
              "creatorId":${cookies.get("iduser")},
             "name":"${this.state.unit_name}",
              "hwTypeId":${this.state.device_name},
              "dataFlags":1}
          &sid=${cookies.get("sid1")}`
    // console.log(url);

    axios.post(url)
      .then(res1 => {
       
cookies.set("unit_id",res1.data.item.id)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_mileage_counter&params={"itemId":${res1.data.item.id},"newValue":${this.state.km}}&sid=${cookies.get("sid1")}`)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_calc_flags&params={"itemId":${res1.data.item.id},"newValue":"0x513"}&sid=${cookies.get("sid1")}`)
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=unit/update_device_type&params={"itemId":${res1.data.item.id},"deviceTypeId":${this.state.device_name},"uniqueId":${this.state.uniqueId}}&sid=${cookies.get("sid1")}`)
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

        this.Resourceid();
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&params={"params":[{"svc":"item/update_custom_property","params":{"itemId":${res1.data.item.id},"name":"img_rot","value":1}}],"flags":0}&sid=${cookies.get("sid1")}`);
        axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_admin_field&params={"itemId":${res1.data.item.id},"n":"Report","v":"${this.state.R_Value}","callMode":"create","id":1}&sid=${cookies.get("sid1")}`)

        if (this.state.VIN !== undefined) {
          axios.post(`https://hst-api.wialon.com/wialon/ajax.html?svc=item/update_profile_field&params={"itemId":${res1.data.item.id},"n":"vin","v":"${this.state.VIN}"}&sid=${cookies.get("sid1")}`)
        }

        toast.success("Unit added successfully ");
        this.btn(this.state.R_Value);
        this.setState({ spinone: false })
        setTimeout(() => {
          this.setState({spanmessage:true})
          this.get_last_msg();
        }, 300);
      })

      .catch(err => {
        // console.log('error:', err);
        this.setState({ spinone: false })
      })
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
          device1: arr
        });
      })
      .catch(err => {
        this.setState({ spindevice: false })
        // console.log("error:", err);
      });
  }


  btn(data) {
    

    htmlToImage.toBlob(document.getElementById('my-node'), { quality: 2.0 })
      .then(function (blob) {
        window.saveAs(blob, `${data}.png`);
      });



    // var node = document.getElementById('my-node');

    // htmlToImage.toPng(node).then(function (dataUrl) {
    //     var img = new Image();
    //     img.src = dataUrl;
    //     var link = document.createElement('a');
    //   link.download = `${data}.jpeg`;
    //   link.href = dataUrl;
    //   link.click();
    // }).catch(function (error) {
    //     console.error('oops, something went wrong!', error);
    // });
  }


  render() {


    const { selectedOption } = this.state;

    return (
      <Context.Consumer>
      {ctx => {
        if (this.state.check === "notlogin") {
          return  <Redirect to='/'></Redirect>;;
        } else if (this.state.check === "login" && this.state.spindevice === false) {

          return (
      <div id="my-node" style={{ backgroundColor: '#fff', padding: 20 }} >

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          autoClose={false}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <div id='form1'  >

          <div id='in_form1' >
            <Navbar expand="lg" style={{ display: 'flex', width: '100%' }}>
              <Navbar.Brand style={{ paddingLeft: '3%' }}>  <img src={require('./logo.png')} style={{ height: 30 }} alt='img' /> </Navbar.Brand>



              <div id='itemnav' >
                <div id='teamnav'>
                  <input type='text' id='field' style={{ width: '100px', marginRight: 12 }} value={this.state.R_Value}
                    onChange={(e) => {
                      this.setState({ R_Value: e.target.value })
                    }} />   التقرير الفني
                            </div>
                <div id='rep_wen' >نظام وينك لتعقب المركبات</div>
              </div>

            </Navbar>
            <div id='dat1'> <span id='spa1n' > : التاريخ </span>
              <input type='date' style={{ width: 150 }} id='field' />  </div>
            <fieldset style={{ marginRight: '2%', width: '95%' }} >
              <legend style={{ width: '9%' }} >   نوع التقرير</legend>
              <div id='divch'>
                <Check name='   نصب' id='chch' />
                {/* <Check name='  رفع'  /> */}
                <Check name='   صيانةاعادة تفعيل ' />
                {/* <Check name='  ابدال' /> */}
                {/* <Check name=' اخرى تذكر' /> */}
                {/* <input type='text' id='inp_2' /> */}

              </div>
            </fieldset>

            <fieldset style={{ width: '95%', marginRight: '2.5%' }} >
              <legend style={{ width: '105px' }}  >بيانات العميل</legend>
              <div id="in_div">
                <span id='spn1' style={{ width: '200px' }}>: اسم العميل</span>
                <input type='text' id='field' style={{ width: '405px' }} />
                <span id='spn1' style={{ width: '200px', paddingRight: 60 }} >: اسم المسؤول</span>
                <input type='text' id='field' style={{ width: 405, marginLeft: 50 }} />
              </div>

              <div id="in_div">
                <span id='spn1' style={{ width: '200px' }}>:  موقع العمل</span>
                <input type='text' id='field' style={{ width: '405px' }} />
                <span id='spn1' style={{ width: '200px', paddingRight: 60 }} >:  الوظيفة</span>
                <input type='text' id='field' style={{ width: 405, marginLeft: 50 }} />
              </div>
            </fieldset>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <fieldset id='filset2' >
                <legend style={{ width: '26%' }} >  في حالة الابدال</legend>
                <div id="in_div">
                  <span id='spn1' >: نوع الجهاز</span>
                  <Select onChange={e => { this.setState({ sto: e.value }); console.log('sto', e.value); }}
                    value={selectedOption}
                    styles={customStyles}
                    options={this.state.device1}
                  />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الجهاز</span> <input type='text' id='field' />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الايمي</span> <input type='text' id='field' />
                </div>

              </fieldset>
              <fieldset>
                <legend style={{ width: '25%' }}  > تفاصيل الجهاز</legend>
                <div id="in_div">
                  <span id='spn1' >: نوع الجهاز</span>
                  <Select onChange={e => { this.setState({ device_name: e.value }); console.log('sto', e.value); }}
                    value={selectedOption}
                    styles={customStyles}
                    options={this.state.device1}
                  />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الجهاز</span> <input type='text' id='field' />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الايمي</span>
                  <input type='text' id='field' value={this.state.uniqueId} onChange={(e) => {
                    this.setState({ uniqueId: e.target.value })
                  }} />
                </div>

              </fieldset>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse' }}>
              <fieldset>
                <legend style={{ width: '26%' }}  > تفاصيل المركبة</legend>
                <div id="in_div">
                  <span id='spn1' >: اسم المركبة</span>
                  <input type='text' id='field' value={this.state.unit_name} onChange={(e) => {
                    this.setState({ unit_name: e.target.value })
                  }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >: التخصص</span> <input type='text' id='field' />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الشاصي</span>
                  <input type='text' id='field' value={this.state.VIN} onChange={(e) => {
                    this.setState({ VIN: e.target.value })
                  }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >: الكيلومترات المقطوعة</span>
                  <input type='text' id='field' value={this.state.km} onChange={(e) => {
                    this.setState({ km: e.target.value })
                  }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم البصمة</span> <input type='text' id='field' value={this.state.tagid} 
                  onChange={(e)=>{
                    this.setState({tagid:e.target.value})
                  }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >: رقم الكود</span> <input type='text' id='field' value={this.state.code} 
                  onChange={(e)=>{
                    this.setState({code:e.target.value})
                  }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >:  اسم السائق</span> <input type='text' id='field' value={this.state.driver_name}
                    onChange={(e) => {
                      this.setState({ driver_name: e.target.value })
                    }} />
                </div>
                <div id="in_div">
                  <span id='spn1' >:  رقم الهاتف</span> <input type='text' id='field' value={this.state.phone}
                    onChange={(e) => {
                      this.setState({ phone: e.target.value })
                    }} />
                </div>
              </fieldset>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '50%' }}>
                <fieldset style={{ marginRight: '10%', width: '90%' }} >
                  <legend style={{ width: '12%' }}  > الصور</legend>
                  <div id='divch'>
                    <Check name='صورة المركبة' />
                    <Check name='صورة السائق' />
                    <Check name='صورة السنوية' />

                  </div>
                  <div id='divch'>
                    <Check name='صورة الشاصي' />
                    <Check name=' اخرى تذكر' />
                    <input type='text' id='inp_2' />
                  </div>
                </fieldset>
                <fieldset style={{ marginRight: '10%', width: '90%' }} >
                  <legend style={{ width: '32%' }} > تحوي المركبة على</legend>
                  <div id='divch'>
                    <Check name=' قاطع الدورة' />
                    <Check name='  بصمة' />
                  </div>
                </fieldset>

                <fieldset  style={{ marginRight: '10%', width: '90%' }}>
                  <legend style={{ width: '12%' }} >  اطفاء</legend>
                  <div id='divch'>
                    <Check name='  قطع نارية' />
                    <Check name='  فيوز' />

                  </div>
                </fieldset>

                <fieldset style={{ marginRight: '10%', width: '90%' }} >
                  <legend style={{ width: '22%' }} >  تفاصيل الربط</legend>
                  <div id='divch'>
                    <Check name='  فتحة نارية' />
                    <Check name='  تبريد' />
                    <Check name='  CAN_BUS' />
                  </div>
                </fieldset>

              </div>

            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>

            
                <fieldset style={{ width: '100%', height: 90 }}   >
                  <legend style={{ width: '28%' }} >  تفاصيل المشرف</legend>
                  <div id="in_div">
                    <span id='spn1' >:  اسم الفني</span>
                    <Select onChange={e => { this.setState({ sto: e.value }); console.log('sto', e.value); }}
                      value={selectedOption}
                      styles={customStyles}
                      options={options}
                    />
                  </div>
                </fieldset>
                <fieldset style={{ width: '100%', height: 90 }} >
                  <legend style={{ width: '20%' }} >   تأييد الانجاز</legend>
                  <div id="in_div">
                    <span id='spn1' >:  اسم المهندس</span> <input type='text' id='field' />
                  </div>
                </fieldset>

              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                <fieldset style={{ width: '90%', marginRight: '10%' }} >
                  <legend style={{ width: '28%' }} >  الملحقات الاخرى</legend>
                  <div id='divch'>
                    <Check name='   هوية السائق' />
                    <Check name='  حساس وقود' />
                    <Check name='  حساس حرارة' />
                    <Check name='بزر سرعة' />

                  </div>
                  <div id='divch'>
                    <Check name='   كامرة' />

                    <Check name=' CAN_BUS' />
                    <Check name=' اخرى تذكر' />

                    <input type='text' id='inp_2' />
                  </div>


                </fieldset>
                <fieldset style={{ marginRight: '10%', width: '90%', height: 150 }} >
                  <legend style={{ width: '18%' }} >  الملاحظات</legend>
                  <div id="in_div">
                    <textarea type='text' style={{ width: '100%', border: 'none', height: 120 }} />
                  </div>
                </fieldset>
              </div>
            </div>

          </div>
        </div>
        <div id='form_add' >

{this.state.spanmessage ===false?(
  <div></div>
):(
  <Dialog name={this.state.item_name} sts={this.state.satellites} /> 
)}



          <div id='addall2' onClick={() => {
             this.checkimei();
            // this.btn();
          }} >Add Unit</div>
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

  get_last_msg(){


    axios
    .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&params={"id":${cookies.get("unit_id")},"flags":1025}&sid=${cookies.get("sid1")}`, {
      headers: {
        Accept: "application/json"
      }
    })
    .then(res => {
  console.log(res.data);
  this.setState({
    item_name:res.data.item.nm,
    satellites:res.data.item.lmsg.pos.sc
  })
  
  })
  .catch(err => {
  
  console.log("error:", err.data);
  });






    setInterval(() => {
      axios
      .get(`https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&params={"id":${cookies.get("unit_id")},"flags":1025}&sid=${cookies.get("sid1")}`, {
        headers: {
          Accept: "application/json"
        }
      })
      .then(res => {
    console.log(res.data);
    this.setState({
      item_name:res.data.item.nm,
      satellites:res.data.item.lmsg.pos.sc
    })
    
    })
    .catch(err => {
    
    console.log("error:", err.data);
    });
    }, 6000);
    

  }



}
export default Form;