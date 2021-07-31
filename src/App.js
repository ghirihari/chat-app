import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Join from './components/Join'
import Room from './components/Room'
import Signup from './components/authentication/signup'
import login from './components/authentication/login'
import Chats from './components/Chats'

class App extends React.Component {

  render(){
  return (
    <Router>
      <Switch>
        <Route exact path="/">
            <Redirect to="/chats" />
        </Route>
        <Route path='/join' component={Join}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/login' component={login}/>
        <Route path='/chats' component={Chats}/>
        <Route path='/room/:roomid/:userid' component={Room}/>
      </Switch>
    </Router>
  );
  }
}

export default App;
