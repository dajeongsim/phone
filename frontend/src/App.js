import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';

import Login from './Login.js';
import Register from './Register.js';
import Phones from './Phones.js';
import Footer from './Footer.js';
// import Phone from './Phone.js';

class App extends Component {

  state = {
    logged : false,
    uId : ''
  }

  logChange(){
    this.setState({logged : !this.state.logged});
    console.log('로그변경');
  }

  setUId(uId){
    this.setState({uId : uId});
  }

  logout(){
    this.setState({logged : false});
  }

  render() {
    // const { router } = this.context;
    // console.log(router);
    return (
      <Router>
        <div className="App">
          {this.state.logged && <button className="logout" type="button" onClick={this.logout.bind(this)}>LOGOUT</button>}
          <h1>PHONE BOOK</h1>
          <div className="nav">
            <NavLink exact to="/" activeClassName="active">LOGIN</NavLink>
            <NavLink to="/register" activeClassName="active">SIGN UP</NavLink>
            <NavLink to="/phone/1" activeClassName="active">PHONE</NavLink>
          </div>
          <hr />
          <div className="component">
            <Route exact path="/" render={
              (props)=>(<Login {...props}
                logged={this.state.logged}
                logChange={this.logChange.bind(this)}
                setUId={this.setUId.bind(this)} />)} />
            <Route exact path="/register" render={
              (props)=>(<Register {...props}
                logged={this.state.logged} />)} />
            <Route path="/phone" render={
              (props)=>(<Phones {...props}
                logged={this.state.logged}
                uId={this.state.uId} />)} />
            {/* <Route path="/phone/:page" component={Phone} /> */}
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
// App.contextTypes = {
//   router: PropTypes.object
// }

export default App;
