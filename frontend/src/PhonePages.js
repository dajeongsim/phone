import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import PropTypes from 'prop-types';

class PhonePages extends Component {

  state = {
    listNum : '',
    pageList : ''
  }

  componentDidMount(){
    this.getListNum();
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.listNum===-1 && nextProps.userId>0){
      // console.log(this.props.userId);
      this.getListNum();
    }
    // console.log(nextProps);
    // console.log(nextState);
    return true;
  }

  getListNum(){
    // console.log(this.props.userId);
    axios.post('http://localhost:4000/phonePages', { userId : this.props.userId })
    .then(res=>{
      this.setState({listNum : res.data.listNum});
      // console.log(res.data.listNum);
      this.pageNation();
    })
    .catch(err=>{
      console.log(err);
    });
  }

  pageNation(){
    const { listNum } = this.state;
    // const { router } = this.context;
    // console.log(router);
    let page;
    let pageList = [];
    if(listNum===0){
      page = 1;
    }else if(listNum%5===0){
      page = listNum/5;
    }else{
      page = listNum/5+1;
    }
    for(let i=1; i<=page; i++){
      pageList.push(<Link to={"/phone/"+i} key={i}>{i}</Link>);
      // console.log(pageList[i-1]);
    }
    this.setState({pageList : pageList});
  }

  render() {
    return (
      <div className="PhonePages">
        {this.state.pageList}
      </div>
    );
  }
}
// PhonePages.contextTypes = {
//   router: PropTypes.object
// }

export default PhonePages;
