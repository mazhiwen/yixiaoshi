import * as React from 'react';
import {
  Layout,Dropdown,Menu,Icon,
  Form,Modal,Input,notification
} from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import {  name,appName} from 'configs';
import routes from 'routes';
import {logOutOperate,localForage,md5} from 'utils';
import { axios } from '../../utils/axios';

// const {  } = Menu;
const {Header}=Layout;
const FormItem=Form.Item;

const menu1=(
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        我的单
      </a>
    </Menu.Item>
    <Menu.Item>
      <Link to={{pathname:`${routes.applylist.base}/all`}}>
        贷款列表
      </Link>
    </Menu.Item>
  </Menu>
);


const PWDModal=Form.create()(
class extends React.Component{
  setPassword=()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('admin/admin', {
          oldPassword: md5(values.oldPassword),
          password: md5(values.newPassword),
          isUpdate:1
        })
        .then((res)=>{
          notification['success']({
            message:'密码已更新',
            description:''
          });
        })
      }
    })
    
  }
  
  render(){
    const {
      isShowPWDModal, onCancel, form,
    } = this.props;
    const { getFieldDecorator,getFieldValue,validateFields} = form;
    const newPasswordValidator = (rule, value, callback) =>{
      if (!value) {
        callback(new Error('请输入新密码'));
      } else {
        if (getFieldValue('newPassword') !== '') {
          validateFields(['newPasswordConfirm']);
        }
        callback();
      }
    }
    const newPwdconVal = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'));
      } else if (value !== getFieldValue('newPassword')) {
        callback(new Error('输入内容与新密码不一致!'));
      } else {
        callback();
      }
    };
    return(
      <Modal
        visible={isShowPWDModal}
        title="修改密码"
        okText="确认"
        onCancel={onCancel}
        onOk={this.setPassword}
      >
        <Form layout="vertical">
          <FormItem label="密码">
            {getFieldDecorator('oldPassword', {
              rules: [{required: true, message: '旧密码不能为空', tragger: 'blur'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="新密码">
            {getFieldDecorator('newPassword', {
              rules: [
                {required: true, validator: newPasswordValidator, tragger: 'blur'}
              ]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="确认新密码">
            {getFieldDecorator('newPasswordConfirm', {
              rules: [
                {required: true, validator: newPwdconVal, tragger: 'blur'}
              ]
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
)



class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      account:'',
      isShowPWDModal:false
    };
  }
  historyPush=(path)=>{
    this.props.history.push(path);
  }
  logOut=()=>{
    logOutOperate();
  }
  setPWDModal=(state)=>{
    this.setState({
      isShowPWDModal:state
    });
  }
  componentDidMount(){
    localForage.getItem(name,(err,v)=>{
      this.setState({
        account:v
      });
      
    });
  }
  render(){
    const menu2=(
      <Menu>
        <Menu.Item>
          <span 
            onClick={this.setPWDModal.bind(this,true)}
          >
            修改密码
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.logOut}>
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );
    const {
      isShowPWDModal
    }=this.state;
    return(
      <div>
        <Header className="header">
          <div className="header_left">
            <div className="logo">
              {appName}
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              className="top_menu"
            >
              {/* <Menu.Item key="1">
                <Dropdown  trigger={['click']} overlay={menu1}>
                  <div>贷款申请<Icon type="down" /></div>
                </Dropdown>
              </Menu.Item> */}

            </Menu>
          </div>

          <Dropdown  
            trigger={['click']} overlay={menu2} 
            placement="bottomRight"
            className="header_right"
          >
            <div>
              
              <a>{this.state.account}<Icon type="down" /></a>
              
            </div>
          </Dropdown>
        </Header>
        <PWDModal
          isShowPWDModal={isShowPWDModal}
          onCancel={this.setPWDModal.bind(this,false)}
        />
      </div>
    )
  }
}

export default withRouter(ComponentInstance)