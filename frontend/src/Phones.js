import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import Phone from './Phone';
import PhonePages from './PhonePages';

class Phones extends Component {

  state = {
    name : '',
    phone : '',
    userId : '',
    success : '',
    clickCnt : 0
  }

  componentDidMount(){
    axios.post('http://localhost:4000/phone/set', {uId : this.props.uId})
    .then(res=>{
      this.setState({userId : res.data.userId});
    })
    .catch(err=>{
      console.log(err);
    });
  }

  handleChange(e){
    this.setState({ [e.target.name] : e.target.value });
  }

  handleClick(){
    if(!this.state.name){
      this.setState({success : -2});
    }else if(!this.state.phone){
      this.setState({success : -3});
    }else{
      axios.post('http://localhost:4000/phone', {
        name : this.state.name,
        phone : this.state.phone,
        userId : this.state.userId })
        .then(res=>{
          // console.log(res.data);
          this.setState({success : res.data.success, clickCnt : this.state.clickCnt+1});
          document.getElementsByName('name')[0].value='';
          document.getElementsByName('phone')[0].value='';
          this.props.history.push('/phone/1');
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
    if(!this.props.logged){
      this.props.history.push('/');
    }
    return (
      <div className="Phones">
        <h2>전화번호부</h2>
        <input type="text" name="name" placeholder="NAME"
        onChange={this.handleChange.bind(this)} /><br />
        <input type="text" name="phone" placeholder="PHONE"
        onChange={this.handleChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} /><br />
        <button onClick={this.handleClick.bind(this)}>저장하기</button>
        <hr />
        {
          (()=>{ switch (this.state.success) {
            case -1: return <div className="msg">이미 등록된 번호입니다.</div>;
            case -2: return <div className="msg">이름을 입력해주세요.</div>;
            case -3: return <div className="msg">전화번호를 입력해주세요.</div>;
            default: return ;
            }
          })()
        }
        <div className="list">
          <Route path="/phone/:page"
            render={(props)=>(<Phone {...props} uId={this.props.uId} clickCnt={this.state.clickCnt} />)} />
        </div>
        <hr />
          <PhonePages userId={this.state.userId} />
      </div>
    );
  }
}

export default Phones;
