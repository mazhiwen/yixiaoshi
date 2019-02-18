import * as React from 'react';
import {
  Form, Button,Row,
  Col,DatePicker,Card,Input,
  notification
} from 'antd';
import {axios} from 'utils';
import moment from 'moment';

const  FormItem =Form.Item;
const { TextArea } = Input;


class PhoneRecordOrigin extends React.Component{
  // constructor(props){
  //   super(props);
  // }

  getData = ()=>{
    axios.get('approvers/approvalInfo?applicationId='+this.props.applicationId)
    .then( (res) =>{
      let data=res.data;
      delete data.applicationId;
      delete data.id;
      data.companyRegisterTime=moment(data.companyRegisterTime);
      data.joinTime=moment(data.joinTime);
      data.telVerOneselfAt=moment(data.telVerOneselfAt);
      data.telVerCompanyAt=moment(data.telVerCompanyAt);
      data.telVerLiaisonAt=moment(data.telVerLiaisonAt);
      this.props.form.setFieldsValue(data);
    })
  }
  submit = ()=>{    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.applicationId=this.props.applicationId;
        values.companyRegisterTime=moment(values.companyRegisterTime).format("YYYY-MM-DD HH:mm:ss");
        values.joinTime=moment(values.joinTime).format("YYYY-MM-DD HH:mm:ss");
        values.telVerOneselfAt=moment(values.telVerOneselfAt).format("YYYY-MM-DD HH:mm:ss");
        values.telVerCompanyAt=moment(values.telVerCompanyAt).format("YYYY-MM-DD HH:mm:ss");
        values.telVerLiaisonAt=moment(values.telVerLiaisonAt).format("YYYY-MM-DD HH:mm:ss");
        axios.post('approvers/approvalInfo',values).then(function (res) {
          notification['success']({
            message:'操作成功',
            description:'保存成功'
          });
        })
      }
    });
  }


  componentDidMount(){
    this.getData();
  }
  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    return (
      <Card
        type="inner"
        title="电核记录"
        extra={<Button type="primary" size="small" onClick={this.submit}>提交</Button>}
      >
        <Form 
          layout='inline' 
          onSubmit={this.handleSubmit}
          className="record_wrap"
        >
          <Card
            type="inner"
            title="基本信息"
            className="recordbasic_wrap"
          >
            <Row>
              <Col span="12">
                <FormItem 
                  label="公司名称"
                >
                  {getFieldDecorator('company')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span="12">      
                <FormItem label="公司地址">
                  {getFieldDecorator('companyAddress')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>  
            <Row>
              <Col span="12">
                <FormItem label="公司电话">
                  {getFieldDecorator('companyTel')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="公司注册时间">
                  {getFieldDecorator('companyRegisterTime')(
                    <DatePicker  />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="第三方电话">
                  {getFieldDecorator('thirdPartyTel')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="入职时间">
                  {getFieldDecorator('joinTime')(
                    <DatePicker  />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="职位">
                  {getFieldDecorator('position')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="工资收入">
                  {getFieldDecorator('incomeMonth')(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            type="inner"
            title="电话记录"
            className="recordcustomer_wrap"
          >
            客户本人
            <Card
              type="inner"
            >
              <Row>
                <Col span="12">
                  <FormItem label="时间">
                    {getFieldDecorator('telVerOneselfAt')(
                      <DatePicker  />
                    )}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="电话号码">
                    {getFieldDecorator('telVerOneself')(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="内容">
                    {getFieldDecorator('telVerOneselfContent')(
                      <TextArea/>
                    )}
                  </FormItem>    
                </Col>
              </Row>
            </Card>
            单位电话
            <Card
              type="inner"
            >
              <Row>
                <Col span="12">
                  <FormItem label="时间">
                    {getFieldDecorator('telVerCompanyAt')(
                      <DatePicker  />
                    )}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="电话号码">
                    {getFieldDecorator('telVerCompany')(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="内容">
                    {getFieldDecorator('telVerCompanyContent')(
                      <TextArea/>
                    )}
                  </FormItem>    
                </Col>
              </Row>
            </Card>
            联系人
            <Card
              type="inner"
            >
              <Row>
                <Col span="12">
                  <FormItem label="时间">
                    {getFieldDecorator('telVerLiaisonAt')(
                      <DatePicker  />
                    )}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="电话号码">
                    {getFieldDecorator('telVerLiaison')(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="内容">
                    {getFieldDecorator('telVerLiaisonContent')(
                      <TextArea/>
                    )}
                  </FormItem>    
                </Col>
              </Row>
            </Card>
          </Card>
          
        </Form>
      </Card>
    )
  }
}
const ComponentInstance =Form.create()(PhoneRecordOrigin);

export default ComponentInstance;

