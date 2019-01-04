import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {

  constructor(props){
    super(props);
    if(this.props.logged){
      this.props.history.push('/phone/1');
    }
  }

  state = {
    uId : '',
    uPass : '',
    success : ''
  }

  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  handleClick(){
    if(!this.state.uId){
      this.setState({success : -2});
    }else if(!this.state.uPass){
      this.setState({success : -3});
    }else{
      axios.post('http://localhost:4000/login', this.state)
      .then(res=>{
        this.setState({success : res.data.success});
        if(res.data.success===1){
          this.props.setUId(this.state.uId);
          this.props.logChange();
          this.props.history.push('/phone/1');
        }
      })
      .catch(err=>{
        console.log(err);
      });
    }
  }

  handleKeyPress(e){
    // console.log(e.keyCode);
    // console.log(e.charCode);
    if(e.charCode===13){
      this.handleClick();
    }
  }

  render() {
    return (
      <div className="Login" onKeyPress={this.handleKeyPress.bind(this)}>
        <h2>로그인</h2>
        <input name="uId" type="text" placeholder="ID"
          onChange={this.handleChange.bind(this)} /><br />
        <input name="uPass" type="password" placeholder="PASSWORD"
          onChange={this.handleChange.bind(this)} /><br />
        <button type="button" onClick={this.handleClick.bind(this)}>LOGIN</button>
        {
          (()=>{ switch (this.state.success) {
            case -1: return <div className="msg">존재하지 않는 아이디입니다.</div>;
            case -2: return <div className="msg">아이디를 입력해주세요.</div>;
            case -3: return <div className="msg">비밀번호를 입력해주세요.</div>;
            case -4: return <div className="msg">비밀번호가 일치하지 않습니다.</div>;
            default: return;
          }
        })()
      }
      </div>
    );
  }
}

export default Login;
