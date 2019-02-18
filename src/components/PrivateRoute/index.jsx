import * as React from 'react';
import { Route,Redirect } from 'react-router-dom'
import {notification } from 'antd';
import {localForage} from 'utils';
import { authToken,
} from 'configs';
import {  connect } from 'react-redux';



class PrivateRoute extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isLogin:''
    };
  }
  
  
  componentDidMount(){
    localForage.getItem(authToken)
      .then((value)=>{
        // 无authtoken 为null
        this.setState({
          isLogin:value
        });
      })
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props.auth&&this.state.isLogin===null){     
      notification['error']({
        message:'请登录帐号',
      });
    }
  }
  render(){
    const { component: Component,auth,...rest }= this.props;
    const {isLogin} =this.state;
    if(isLogin===''){
      return (
        <div></div>
      )
    }
    return(
      <Route
        {...rest}
        render={props =>
           
          (
            <Component {...props} />
          ) 
        }
      />
    )
  }
}


function mapStateToProps(state) {
  return{
    // LOGINSTATUS:state.login.LOGINSTATUS
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // SET_LOGINSTATUS: (LOGINSTATUS) => dispatch({
    //   type: 'SET_LOGINSTATUS',
    //   LOGINSTATUS
    // })
  }; 
}


export default connect(mapStateToProps,mapDispatchToProps)(PrivateRoute);