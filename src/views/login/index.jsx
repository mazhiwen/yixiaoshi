import * as React from 'react';
import {Card, Form, Icon, Input, Button,notification,
  Row,Col
} from 'antd';
import {  connect } from 'react-redux';
import { authToken, authMobile,
  XPARTNERCODE,partnerCode,appName,expires, domain,
  name
} from 'configs';
import routes from 'routes';
import {axios,localForage,cookie,validator} from 'utils';
import {withRouter} from "react-router-dom";

class ComponentInstance extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isLogin:true,
      countSms:0
    };
    this.params={

    }
    this.SmsInput = React.createRef();
    this.countdownInteval=null;
  }
  historyPush=(path)=>{
    this.props.history.push(path);
  }
  handleLogin = (e) => {
    e.preventDefault();
    // this.historyPush( routes.home.path);
    this.props["form"].validateFields((err, values) => {
      if (!err) {
        axios.post('Domain-authority/v1/user-login', {...this.params,...values}, { useOrigin: true })
          .then((res) => {
            
            const { data: { code = '', message = '' }, headers } = res;
            const token = headers[authToken];
            const mobile = values.loginName;
            localForage.setItem(authToken,token)
            localForage.setItem(name,res.data.result.name)
            if (['11310025', '11310026'].indexOf(code) !== -1) {
              cookie.set({
                key: authMobile,
                value:token,
                expires 
              });
              this.$Modal.confirm({
                title: '温馨提示',
                content: message,
                okText: '现在修改',
                cancelText: '放弃登录',
                onOk: () => this.$router.push({ name: 'setting.profile'}),
              })
              return;
            }
            cookie.set({
              key: authToken,
              value:token,
              end: expires,
              domain
            });
            cookie.set({
              key: authMobile,
              value:mobile,
              end: expires,
              domain
            });
            if (!cookie.get(authToken)) {
              cookie.set({
                key: authToken,
                value:token,
                end: expires
              });
              cookie.set({
                key: authMobile,
                value:mobile,
                end: expires
              });
            }
            // this.props.dispatch({
            //   type: 'SET_LOGINSTATUS',
            //   LOGINSTATUS:true
            // })
            this.historyPush( routes.home.path);
            
          }) 
      }
    });
  }
  countdown (countSms) {
    this.setState({
      countSms
    });
    this.countdownInteval=setInterval(()=>{
      if(countSms>0){
        countSms--;
        this.setState({
          countSms
        });
        
      }else{
        clearInterval(this.countdownInteval);
        
      }
    },1000);
  }
  getSms =()=> {

    this.props['form'].validateFields((errors, values) => {
      if(errors&&errors.loginName){
        
      }else{
        axios.post('Domain-authority/v1/send-mobile-code', {
          mobile: this.props["form"].getFieldValue('loginName'),
          type: '01',
        })
          .then((res) => {
            this.countdown(60);
            this.params.codeId = res.result.codeId;
            notification['success']({
              message:'短信验证码已发送至手机',
            });
            this.SmsInput.current.focus();
          })
      }
    });
    
      
    
    
  }

  registHandler=()=>{
    this.setState({
      isLogin:false
    });
  }
  



  componentDidMount(){
    let params = new URLSearchParams(this.props.location.search);
    localForage.setItem(XPARTNERCODE,params.get(partnerCode));
  }
  componentWillUnmount(){
    // this.setState = (state,callback)=>{
    //   return;
    // };
    clearInterval(this.countdownInteval);
  }
  render(){
    const { getFieldDecorator,getFieldValue } = this.props['form'];
    const {countSms} =this.state;
    return(
      <div className="page_login">
        <h2>{appName}</h2>
        <Card 
          // bordered={false}
          className="form_login"
          hoverable={true}
          >
          
          <Form id="aaa" onSubmit={this.handleLogin} 
            className="antdformitem_flexwrap "
          >
            <Form.Item  label="手机号">
              {getFieldDecorator('loginName', {
                rules: [
                  { 
                    validator:(rule, value, callback, source, options)=> {
                      var errors = [];
                      let pattern=validator.getPattern({type:'mobile'});
                      if(!pattern.pattern.test(value)) {
                        errors.push(new Error(pattern.errorMessage));
                      }
                      callback(errors);
                    }
                  }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Username" 
                />
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                // rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            <Form.Item
              label="验证码"
            >
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('codeValue', {
                    // rules: [{ required: true, message: 'Please input the captcha you got!' }],
                  })(
                    <Input ref={this.SmsInput}/>
                  )}
                </Col>
                <Col span={12}>
                  <Button 
                    block
                    disabled={countSms>0}
                    onClick={this.getSms}
                  >
                    {countSms===0&&<span>获取验证码</span>}
                    {countSms>0&&<span>{countSms}S后重新获取</span>}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            
            <Form.Item className="login_btn">
              <Button type="primary" htmlType="submit" 
                className="login-form-button"
                block
                >
                登陆
              </Button>
            </Form.Item>
            
          </Form>
          

        </Card>
      </div>
      
    )
  }
  
}



const Login = withRouter(connect()(Form.create()(ComponentInstance)));
export default Login