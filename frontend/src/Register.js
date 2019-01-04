import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {

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
      axios.post('http://localhost:4000/register', {
        uId : this.state.uId,
        uPass : this.state.uPass })
      .then(res=>{
        console.log(res.data);
        this.setState({success : res.data.success});
        if(res.data.success===1){
          this.props.history.push('/');
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
      <div className="Register" onKeyPress={this.handleKeyPress.bind(this)}>
        <h2>회원가입</h2>
        <input name="uId" type="text" placeholder="ID"
          onChange={this.handleChange.bind(this)} /><br />
        <input name="uPass" type="password" placeholder="PASSWORD"
          onChange={this.handleChange.bind(this)} /><br />
        <button type="button" onClick={this.handleClick.bind(this)}>SIGN UP</button>
        {/*(this.state.success===-1) && (<div>이미 사용중인 아이디입니다.</div>)*/}
        {
          (()=>{ switch (this.state.success) {
            case -1: return <div className="msg">이미 사용중인 아이디입니다.</div>;
            case -2: return <div className="msg">아이디를 입력해주세요.</div>;
            case -3: return <div className="msg">비밀번호를 입력해주세요.</div>;
            default: return;
            }
          })()
        }
      </div>
    );
  }
}

export default Register;
