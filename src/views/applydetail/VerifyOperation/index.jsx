import * as React from 'react';
import {
  Form, Button,Select,
  Card,Input,
  InputNumber,notification
} from 'antd';
import {axios} from 'utils';


const  FormItem =Form.Item;
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;
const {Fragment} = React;


class VerifyOperationOrigin extends React.Component{
  constructor(props){
    super(props);
    this.state=({
      operation:'',
      operationList:[
        {code: "accept", name: "通过"},
        {code: "reject", name: "拒绝"}
      ],
      tenorsDataList:[
        "1M", "2M", "3M", "4M", "5M", "6M", "9M", "12M", "18M", "24M"
      ],
    })
  }
  operationChange=(operation)=>{
    this.setState({
      operation
    })
  }
  submit=()=> {
    const {
      applyData
    } = this.props;
    function joinCodeList(codeList) {
      if (codeList && (codeList instanceof Array)) {
        if(codeList[1] === '' && codeList[2] !==''){
          return codeList.join(',')
        }else{
          return codeList.join(',').replace(/,(?![a-zA-Z\d])/g,'')
        }
      }
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          operation,
          reasonCodeList,
          remark,
          tenor
        } = values;
        let params = {
          remark,
          tenor
        };
        switch(operation) {
          case 'accept':
            let {amount} = values;
            params.amount = amount;
            break;
          case 'reject':
            params.reasonCode = joinCodeList(reasonCodeList);
            break;
          default:
            break;  
        }
        axios.post('applications/'+applyData.applicationId+'/approval/init/'+operation, params)
          .then(function(res) {
            notification['success']({
              message:'操作成功',
              description:'申请单已提交，如需了解后续结果，请关注我的单—>我的历史单'
            });
          },function(err) {
          })
      }
    });
  }
  render(){
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      applyData
    } = this.props;
    const {
      operation,operationList,tenorsDataList
    }=this.state;
    return (
      <Card
        type="inner"
        title={`初审`}
        // title={`初审${applyData.approver}`}
        extra={<Button type="primary"  size="small" onClick={this.submit}>提交</Button>}
      >
        {
          operation==='accept'&&<Card className="operation_top">
            <span>产品: {applyData.productName}</span>
            <span>批核流程: {applyData.approvalNote}</span>
            <span>产品额度上限: {applyData.DomainProduct&&applyData.DomainProduct.maxAmount}</span>
          </Card>
        }
        <Form 
          onSubmit={this.submit}
          className="antdformitem_flexwrap"
        >
          <FormItem label="审批操作" 
          >
            {getFieldDecorator('operation')(
              <Select
                onChange={this.operationChange}
              >
                {
                  operationList.map((value,index)=>(
                    <Option value={value.code} key={index}>{value.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          {operation==='accept'&&<Fragment>
            <FormItem  label="建议信用额度">
              {getFieldDecorator('amount',{
                rules:[{
                  validator:(rule, value, callback)=>{
                    var errors = [];
                    if(
                      !/^[1-9]\d{3,}$/.test(value) ||
                      value % 100 !== 0 ||
                      value < 3000
                    ){
                      errors.push(
                        new Error(
                          '授予额度填写有误'
                        )
                      );
                    }
                    callback(errors);
                  }
                }]
              })(
                <InputNumber 
                  min={500} step="100" max={20000} 
                  addonAfter="元" placeholder="500-20000"
                  style={{width:'100%'}}
                />
              )}
            </FormItem>
            <FormItem  label="批核期限"
            >
              {getFieldDecorator('tenor',{
              })(
                <Select>
                  {
                    tenorsDataList.map((value,index)=>(
                      <Option value={value} key={index}>{value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Fragment>}
          {operation==='reject'&&<Fragment>
            <FormItem className="reasoncode_wrap" label="原因代码">
              <InputGroup compact>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[0]')(
                    <Input placeholder="代码1" />
                  )}
                </FormItem>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[1]')(
                    <Input placeholder="代码2"/>
                  )}
                </FormItem>
                <FormItem >
                  {getFieldDecorator('reasonCodeList[2]')(
                    <Input placeholder="代码3"/>
                  )}
                </FormItem>
              </InputGroup>
            </FormItem>
          </Fragment>}  
          <FormItem label="审批备注">
            {getFieldDecorator('remark')(
              <TextArea />
            )}
          </FormItem>
        </Form>
      </Card>
    )
  }
}
const VerifyOperation =Form.create()(VerifyOperationOrigin);



export default VerifyOperation;
