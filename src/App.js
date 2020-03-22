import React,{Component} from 'react';
import Login from './Component/Login';
import Home from './Component/Home';
import Context from './Component/context';
import {BrowserRouter,Route , Switch} from 'react-router-dom';


class App extends Component{
render() {
  return (

  
    <BrowserRouter>
        <Context.Provider value={{
            value: this.state,
            action: {
            }}} >
    <Route exact path ='/' component={Login } />

  
    <Switch>
    <Route path ='/Home' component={Home} />
  
    
    
    </Switch> 
  
   
    </Context.Provider>
    </BrowserRouter>
  );
}
}
export default App;
