import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Modal,notification,TreeSelect
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,utiDate,commonRequest,localForage} from 'utils';
import routes from 'routes';
import {
  blacklistTypeValueMap,userEmail,blackTypeTreeData,
  crimeCategoryToText,crimeCategoryToParams,
  relationshipList,
} from 'configs';

import moment from 'moment';
import  {FormItemI} from 'components';
const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem=Form.Item;
const {Fragment} = React;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;








const ModalInstance=Form.create()(
class extends React.Component{
  onOk=()=>{
    const {type,params}=this.props.data;
    axios.post(`v1/blacklist/${blacklistTypeValueMap[type].addUrl}/add`, params)
      .then((res)=> {
        this.props.onCancel();
        notification['success']({
          message:'操作成功',
          description:'已添加'
        });
      })
      .finally(()=>{
        
      })
    
  }
  
  render(){
    const {
      isShowModal, onCancel, form,data
    } = this.props;
    const { getFieldDecorator,getFieldValue,validateFields} = form;
    
    return(
      <Modal
        visible={isShowModal}
        title="加黑信息确认"
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        onOk={this.onOk}
      >
        {data.type&&<Form 
          className="inlineblock_formwrap"
        >
          <FormItemI label="加黑类型：">
            <span>{`${blacklistTypeValueMap[data.type]['text']}加黑`}</span>
          </FormItemI>
          {(data.type==='PHONE_NUMBER'||data.type==='CNID')&&<Fragment>
            <FormItemI label="姓名：">
              <span>{data.params.personalName}</span>
            </FormItemI>
            <FormItemI label="手机号：">
              <span>{data.params.phoneNumber}</span>
            </FormItemI>
            <FormItemI label="手机号加黑类型">
              <span>{crimeCategoryToText(data.formValues.mobile.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="手机号加黑备注：">
              <span>{data.formValues.mobile.crimeDetails}</span>
            </FormItemI>
            <FormItemI label="身份证号：">
              <span>{data.params.cnid}</span>
            </FormItemI>
            <FormItemI label="身份证号加黑类型：">
              <span>{crimeCategoryToText(data.formValues.cnid.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="身份证号加黑备注：">
              <span>{data.formValues.cnid.crimeDetails}</span>
            </FormItemI>
          </Fragment>}
          {data.type==='LISONS_PHONE'&&<Fragment>
            <FormItemI label="姓名：">
              <span>{data.params.personalName}</span>
            </FormItemI>
            <FormItemI label="手机号：">
              <span>{data.params.phoneNumber}</span>
            </FormItemI>
            <FormItemI label="关系：">
              <span>{relationshipList[data.params.relation].description}</span>
            </FormItemI>
            <FormItemI label="联系人手机号加黑类型">
              <span>{crimeCategoryToText(data.params.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="联系人手机号加黑备注：">
              <span>{data.params.crimeDetails}</span>
            </FormItemI>
          </Fragment>}
          {(data.type==='COMPANY_NAME'||data.type==='COMPANY_TELEPHONE')&&<Fragment>
            <FormItemI label="公司名称：">
              <span>{data.params.companyName}</span>
            </FormItemI>
            <FormItemI label="公司名称加黑类型：">
              <span>{crimeCategoryToText(data.formValues.companyname.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="公司名称加黑备注：">
              <span>{data.formValues.companyname.crimeDetails}</span>
            </FormItemI>
            <FormItemI label="公司电话：">
              <span>{data.params.companyTelephone}</span>
            </FormItemI>
            <FormItemI label="身份证号加黑类型：">
              <span>{crimeCategoryToText(data.formValues.companytelephone.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="身份证号加黑备注：">
              <span>{data.formValues.companytelephone.crimeDetails}</span>
            </FormItemI>
          </Fragment>}
        </Form>}
      </Modal>
    )
  }
}
)
class Add extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      isShowModal:false,
      applicationId:'',
      paramsBasic:{
        phone:'',
        name:''
      },
      liaisons:[],
      addConfirmModalData:{}
    }
  }
  
  addBlack=({type,liasonKey})=>{
    
    this.addType=type;
    this.addLiasonKey=liasonKey;
    this.props.form.validateFieldsAndScroll({force:true},(errors,formValues) => {
      if(!errors){
        this.setModal(true);
        const {applicationId} = this.state;
        let contacts=[];
        formValues.liaisons&&formValues.liaisons.map((value,index)=>{
          contacts.push(value.mobile)
        })
        let params = {
          traceabilityCode: applicationId,
        };
        if(type==='PHONE_NUMBER'||type==='CNID'){
            params.cnid=formValues.cnid.value;
            params.personalName=formValues.name;
            params.phoneNumber=formValues.mobile.value;
            if(type==='PHONE_NUMBER'){
              params.crimeDetails=formValues.mobile.crimeDetails;
              params.crimeCategory=crimeCategoryToParams(formValues.mobile.crimeCategory);
              params.relation=applicationId ? '进件者本人' : '';
              params.contacts=contacts;
            }else if(type==='CNID'){
              params.crimeDetails=formValues.cnid.crimeDetails;
              params.crimeCategory=crimeCategoryToParams(formValues.cnid.crimeCategory);
            }
        }else if(type==='LISONS_PHONE'){
          params.contacts=contacts;
          params.phoneNumber=formValues.liaisons[liasonKey].mobile;
          params.personalName=formValues.liaisons[liasonKey].name;
          params.crimeDetails=formValues.liaisons[liasonKey].crimeDetails;
          params.crimeCategory=crimeCategoryToParams(formValues.liaisons[liasonKey].crimeCategory);
          params.relation = formValues.liaisons[liasonKey].relationship;
        }else if(type==='COMPANY_NAME'||type==='COMPANY_TELEPHONE'){
          params.companyTelephone=formValues.companytelephone.value;
          params.companyName=formValues.companyname.value;
          if(type==='COMPANY_NAME'){
            params.crimeDetails=formValues.companyname.crimeDetails;
            params.crimeCategory=crimeCategoryToParams(formValues.companyname.crimeCategory);
          }else if(type==='COMPANY_TELEPHONE'){
            params.crimeDetails=formValues.companytelephone.crimeDetails;
            params.crimeCategory=crimeCategoryToParams(formValues.companytelephone.crimeCategory);
          }
        }
        this.setState({
          addConfirmModalData:{
            type,
            params,
            formValues
          }
        });
      }
    })
  }
   
  search=(applicationId)=>{
    // CA19012416050633742799591   19012517043381665646872
    this.setState({
      applicationId
    });
    if(!applicationId){
      // this.$Message.info('查询条件不能为空！');
      return false;
    }
    axios.get('v1/blacklist/application/info',{
      params:{
        applicationId
      }
    })
    .then(res=>{
      let result = res.result;
      // //联系人
      // if(data.liaisons.length>0){
      //   this.contacts = [];
      //   data.liaisons.forEach(element => {
      //     this.contacts.push({
      //       name: element.name,
      //       phone: element.mobile,
      //       relationship: element.relationship ? element.relationship : '',
      //       relationshipName: this.getRelationshipName(this.relationList, element.relationship)
      //     });
      //   });
      // }
      //公司信息
      this.props.form.setFieldsValue({
        name:result.profile.name,
        mobile:{
          value:result.user.mobile
        },
        cnid:{
          value:result.profile.cnid
        },
        companyname:{
          value:result.company.name
        },
        companytelephone:{
          value:result.company.telephone
        },
        
      });
      this.setState({
        liaisons:result.liaisons
      })
    })
    
  }
  setModal=(state)=>{
    this.setState({
      isShowModal:state
    });
  }

  componentDidMount(){
    localForage.getItem(userEmail)
      .then((userEmail)=>{
        this.setState({
          userEmail
        });
      })
  }
  // CA18110814371708272900334
  render(){
    const {
      isShowModal,liaisons,addConfirmModalData
    }=this.state;
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const blackTypeSelector=(
      <TreeSelect
        showSearch
        // style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        multiple
        treeData={blackTypeTreeData}
        onChange={this.onChange}
      />
        
    );
    const addBlackTypeValidator=(addType)=>{
      return (rule, value, callback) => {
        if (this.addType===addType&&!value) {
          callback(`请选择${blacklistTypeValueMap[addType].text}加黑类型`);
        } else {
          callback();
        }
      }
    }
    const Liaisons = liaisons.map((value,key)=>(
      <Fragment key={key}>
        <br/>
        <Card title={`联系人信息${key+1}`}
          extra={
            <div>
              <Button
                type="primary" 
                onClick={this.addBlack.bind(this,{
                  type:'LISONS_PHONE',
                  liasonKey:key
                })}
              >
                加黑手机号-联系人
              </Button>
            </div>

          }
        >
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI  label="姓名">            
                {getFieldDecorator(`liaisons[${key}].name`, {
                  initialValue:value.name
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="关系">            
                {getFieldDecorator(`liaisons[${key}].relationship`, {
                  initialValue:value.relationship
                })(
                  <Select 
                  >
                    {Object.entries(relationshipList).map(([indexr,valuer])=>(
                      <Option key={indexr} value={indexr}>{valuer.description}</Option>
                    ))
                    }
                  </Select>
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="手机号">            
                {getFieldDecorator(`liaisons[${key}].mobile`, {
                  initialValue:value.mobile,
                  rules:[
                    {
                      validator:(rule, value, callback) => {
                        if (this.addType==='LISONS_PHONE'&&this.addLiasonKey===key&&!value) {
                          callback(`请输入联系人${key+1}手机号`);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="联系人加黑类型">            
                {getFieldDecorator(`liaisons[${key}].crimeCategory`, {
                  rules: [
                    {
                      validator: addBlackTypeValidator('LISONS_PHONE')
                    }
                  ]
                })(
                  blackTypeSelector
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="联系人备注">            
                {getFieldDecorator(`liaisons[${key}].crimeDetails`, {
                  rules: [
                    {
                      
                    }
                  ]
                })(
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
                )}
              </FormItemI>
            </Col>
          </Row>
           
        </Card>
      </Fragment>
    ))
    return(
      <div>
        <br/> 
        <div>
          <FormItem>            
            <Input.Search
              placeholder="CA19012416050633742799591"
              enterButton="查找贷款号"
              value="CA19012416050633742799591"
              style={{width:400}}
              onSearch={this.search}
            />
          </FormItem>
        </div>
        <Form>
        <Card
          title="个人信息"
          extra={
            <div>
              <Button
                type="primary" 
                onClick={this.addBlack.bind(this,{type:'PHONE_NUMBER'})}
              >
                加黑手机号
              </Button>
              <Button
                style={{
                  marginLeft:10
                }} 
                type="primary" 
                onClick={this.addBlack.bind(this,{type:'CNID'})}
              >
                加黑身份证
              </Button>
            </div>
          }
        >
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI label="姓名">            
                {getFieldDecorator('name', {
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI label="手机号">            
                {getFieldDecorator('mobile.value', {
                  rules:[
                    {
                      validator:(rule, value, callback) => {
                        if (this.addType==='PHONE_NUMBER'&&!value) {
                          callback(`请输入手机号`);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI label="手机号加黑类型">
                  {getFieldDecorator('mobile.crimeCategory', {
                    rules: [
                      {
                        validator: addBlackTypeValidator('PHONE_NUMBER')
                      }
                    ]
                  })(
                    blackTypeSelector
                  )}

              </FormItemI>
            </Col>

            <Col span={8}>
              <FormItemI  label="手机号备注">            
                {getFieldDecorator('mobile.crimeDetails', {
                  rules: [
                    {
                      
                    }
                  ]
                })(
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
                )}
              </FormItemI>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI  label="身份证">            
                {getFieldDecorator('cnid.value', {
                  rules:[
                    {
                      validator:(rule, value, callback) => {
                        if (this.addType==='CNID'&&!value) {
                          callback(`请输入身份证号`);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="身份证加黑类型">            
                {getFieldDecorator('cnid.crimeCategory', {
                  rules: [
                    {
                      validator: addBlackTypeValidator('CNID')
                    }
                  ]
                })(
                  blackTypeSelector
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="身份证备注">            
                {getFieldDecorator('cnid.crimeDetails', {
                  rules: [
                    {
                      
                    }
                  ]
                })(
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
                )}
              </FormItemI>
            </Col>
          </Row>
            
        </Card>
        <br/>
        
        {Liaisons}
        
        <br/>
        <Card title="公司信息"
          extra={
            <div>
              <Button type="primary"  
                onClick={this.addBlack.bind(this,{type:'COMPANY_NAME'})}
              >
                加黑公司名称
              </Button>
              <Button type="primary"
                style={{
                  marginLeft:10
                }}  
                onClick={this.addBlack.bind(this,{type:'COMPANY_TELEPHONE'})}
              >
                加黑公司电话
              </Button>
            </div>  
          }
        >
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI  label="公司名称">            
                {getFieldDecorator('companyname.value', {
                  rules:[
                    {
                      validator:(rule, value, callback) => {
                        if (this.addType==='COMPANY_NAME'&&!value) {
                          callback(`请输入公司名称`);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="公司名称加黑类型">            
                {getFieldDecorator('companyname.crimeCategory', {
                  rules: [
                    {
                      validator: addBlackTypeValidator('COMPANY_NAME')
                    }
                  ]
                })(
                  blackTypeSelector
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="公司名称备注">            
                {getFieldDecorator('companyname.crimeDetails', {
                  rules: [
                    {
                      
                    }
                  ]
                })(
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
                )}
              </FormItemI>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItemI  label="公司电话">            
                {getFieldDecorator('companytelephone.value', {
                  rules:[
                    {
                      validator:(rule, value, callback) => {
                        if (this.addType==='COMPANY_TELEPHONE'&&!value) {
                          callback(`请输入公司电话`);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]
                })(
                  <Input
                    
                  />
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="公司电话加黑类型">            
                {getFieldDecorator('companytelephone.crimeCategory', {
                  rules: [
                    {
                      validator: addBlackTypeValidator('COMPANY_TELEPHONE')
                    }
                  ]
                })(
                  blackTypeSelector
                )}
              </FormItemI>
            </Col>
            <Col span={8}>
              <FormItemI  label="公司电话备注">            
                {getFieldDecorator('companytelephone.crimeDetails', {
                  rules: [
                    {
                      
                    }
                  ]
                })(
                  <TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
                )}
              </FormItemI>
            </Col>
          </Row>
          
        </Card>
        </Form>
        <ModalInstance
          data={addConfirmModalData}
          isShowModal={isShowModal}
          onCancel={this.setModal.bind(this,false)}
        />
      </div>
    )
  }
}

export default Form.create()(Add)