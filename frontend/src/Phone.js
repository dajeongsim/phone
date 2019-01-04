import React, { Component } from 'react';
import axios from 'axios';

class Phone extends Component {

  state = {
    name : '',
    phone : '',
    userId : '',
    phoneList : [],
    list : [],
    uList : [],
    rList : [],
    update : 0,
    success : '',
    page : ''
  }

  // warning 해결하기!!!
  componentDidMount(){
    axios.post('http://localhost:4000/phone/set', {uId : this.props.uId})
    .then(res=>{
      this.setState({userId : res.data.userId});
      // this.getList(res.data.userId);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log(nextProps);
    // console.log(nextState);
    // console.log(this.props.clickCnt);
    const pPage = nextProps.match.params.page;
    const sPage = nextState.page
    // console.log(pPage);
    // console.log(sPage);
    if((sPage!==pPage) || (this.props.clickCnt!==nextProps.clickCnt)){
    // if((pPage==='1')){
      this.getList(this.state.userId);
      console.log(pPage);
      // console.log('should getList');
      return false;
    } else{
      return true;
    }
  }

  getList(userId){
    axios.post('http://localhost:4000/phone/list', {userId : userId})
    .then(res=>{
      this.setState({phoneList : res.data.list, page : this.props.match.params.page});
      this.writeList();
      // console.log('getlist');
    })
    .catch(err=>{
      console.log(err);
    });
  }

  writeList(){
    const {phoneList} = this.state;
    // console.log(phoneList);
    const list = phoneList.map(value=>{
      return (
        <div className="phoneList" key={value.phoneId}>
          <div className="phoneEl">이름 : {value.name}</div>
          <div className="phoneEl">전화번호 : {value.phone}</div>
          <button className="phoneBtn" type="button" onClick={this.updateList.bind(this, value)}>수정</button>
          <button className="phoneBtn" type="button" onClick={this.deleteList.bind(this, value.phoneId)}>삭제</button>
        </div>
      );
    });
    this.setState({list : list});
    this.pagingList(list);
  }

  pagingList(list){
    const { page } = this.props.match.params;
    const firstNum = (page-1)*5;
    const lastNum = page*5;
    let rList = list.slice(firstNum, lastNum);
    this.setState({rList : rList});
    // console.log(rList);
  }

// input 태그에 default로 현재 name, phone 넣어주기!(현재 props라서 readonly)
  updateList(value){
    const index = this.state.phoneList.indexOf(value);
    const uList = this.state.list;
    uList[index] =
        <div className="phoneList" key={value.phoneId}>
          <div className="phoneEl">이름 : <input className="phoneInput" type="text" placeholder={value.name}
          name="name" onChange={this.handleChange.bind(this)} /></div>
          <div className="phoneEl">전화번호 : <input className="phoneInput" type="text" placeholder={value.phone}
          name="phone" onChange={this.handleChange.bind(this)} /></div>
          <button className="phoneBtn" type="button" onClick={this.checkUpdate.bind(this, value.phoneId)}>완료</button>
          <button className="phoneBtn" type="button" onClick={this.cancelUpdate.bind(this)}>취소</button>
        </div>;
    this.setState({name : value.name, phone : value.phone, update : 1, uList : uList});
    this.pagingList(uList);
  }

  checkUpdate(phoneId){
    axios.post('http://localhost:4000/phone/update',
      {phoneId : phoneId, userId : this.state.userId, name : this.state.name, phone : this.state.phone})
    .then(res=>{
      console.log(res.data.success);
      this.setState({success : res.data.success});
      if(res.data.success===1){
      this.setState({update : 0, name : '', phone : ''});
      this.getList(this.state.userId);
      }
    })
    .catch(err=>{
      console.log(err);
    });
  }

  cancelUpdate(){
    this.setState({update : 0, name : '', phone : ''});
    this.getList(this.state.userId);
  }

  deleteList(phoneId){
    axios.post('http://localhost:4000/phone/delete', {phoneId : phoneId})
    .then(res=>{
      this.getList(this.state.userId);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  handleChange(e){
    this.setState({ [e.target.name] : e.target.value });
  }

  render() {
    // console.log('render');
    return (
      <div className="Phone">
        {/* {this.state.update===0 && this.state.rList}
        {this.state.update===1 && this.state.uList} */}
        {this.state.rList}
        {/* {this.props.match.params.page} */}
      </div>
    );
  }
}

export default Phone;
