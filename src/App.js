import React,{Component} from 'react';
import Login from './Component/Login';
import User from './Component/User';
import Context from './Component/context';
import {BrowserRouter,Route } from 'react-router-dom';
import Si from './Component/Si';
import Failed from './Component/Failed';
import Succes from './Component/Succes';
import Form1 from './Component/Form1';
import Accounts from './Component/Accounts';

class App extends Component{
render() {
  return (

  
    <BrowserRouter>
        <Context.Provider value={{
            value: this.state,
            action: {
            }}} >
    <Route exact path ='/' component={Login } />

  
 
   
    <Route path ='/User' component={User} />
    <Route path ='/Si' component={Si} />
    <Route path ='/Failed' component={Failed} />
    <Route path ='/Succes' component={Succes} />
    <Route path ='/Form1' component={Form1} />
   
    <Route path ='/Accounts' component={Accounts} />
  
   
    </Context.Provider>
    </BrowserRouter>
  );
}
}
export default App;
