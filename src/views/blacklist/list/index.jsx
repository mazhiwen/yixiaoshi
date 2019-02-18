import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Divider,notification,Modal
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,utiDate,commonRequest} from 'utils';
import routes from 'routes';
import {blacklistTypeValueMap,crimeCategoryToText} from 'configs';
import  {FormItemI} from 'components';

import moment from 'moment';
const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem=Form.Item;
const {Fragment} = React;
function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=100;


const ModalInstance=Form.create()(
  class extends React.Component{
    onOk=()=>{
      const {data } =this.props;
      this.props.form.validateFields((err, formValues) => {
        if (!err) {
          axios.delete('v1/blacklist/delete', {
            params:{
              id:data.id,
              reason:formValues.reason
            }  
          })
          .then((res)=>{
            this.props.onOkCallback();
            this.props.onCancel();
            notification['success']({
              message:'操作成功',
              description:'已删除'
            });
          })
        }
      })
      
    }
    // 
    render(){
      const {
        isShowModal, onCancel, form,data
      } = this.props;
      const { getFieldDecorator,getFieldValue,validateFields} = form;
      
      return(
        <Modal
          visible={isShowModal} title="删除确认"
          okText="删除" cancelText="取消" okType="danger"
          onCancel={onCancel} onOk={this.onOk}
        >
          {data.blacklistType&&<Form className="inlineblock_formwrap">
            <FormItemI label="加黑类型">
              <span>{`${blacklistTypeValueMap[data.blacklistType]['text']}`}</span>
            </FormItemI>
            {
            (data.blacklistType=='CNID'||data.blacklistType=='PHONE_NUMBER')&&
            <Fragment>
              <FormItemI label="姓名">
                <span>{data.personalName}</span>
              </FormItemI>
              <FormItemI label="手机号">
                <span>{data.phoneNumber}</span>
              </FormItemI>
              <FormItemI label="身份证号">
                <span>{data.cnid}</span>
              </FormItemI>
            </Fragment>
            }
            {
            (data.blacklistType=='COMPANY_NAME'||data.blacklistType=='COMPANY_TELEPHONE')&&
            <Fragment>
              <FormItemI label="公司名称：">
                <span>{data.companyName}</span>
              </FormItemI>
              <FormItemI label="公司电话：">
                <span>{data.companyTelephone}</span>
              </FormItemI>
            </Fragment>
            }
            <FormItemI label="加黑原因">
              <span>{crimeCategoryToText(data.crimeCategory)}</span>
            </FormItemI>
            <FormItemI label="备注">
              <span>{data.crimeDetails}</span>
            </FormItemI>
            <FormItemI label="删除原因">
              {getFieldDecorator('reason', {
                rules: [
                  {
                    required: true, message: '请选择删除原因!',
                  }
                ]
              })(
                <Select style={{ width: 110 }}>
                  <Option value="客户投诉">客户投诉</Option>
                  <Option value="操作有误">操作有误</Option>
                </Select>
              )}
            </FormItemI>
          </Form>}
        </Modal>
      )
    }
  }
)







class Query extends React.Component{

  constructor(props){
    super(props);
    this.state={
      toDeleteBlackItem:{},
      isShowModal:false,
      total:0,
      cnidLists:[],
      phoneLists:[],
      companyNameLists:[],
      companyPhoneLists:[],
      provinceList:[],
      productList:[],
      processStatusList:[
        {id: 4,name: '全部'},
        {id: 0,name: ' 待处理'},
        {id: 1,name: ' 处理中'},
        {id: 2,name: '已处理'}
      ],
      receiveList:[
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '是'
        },
        {
          id: 2,
          name: '否'
        },
      ],
    };
    this.searchType='loanId';
    this.savedSearchParams={};
    const getColumnsData=(value)=>{
      return [
        {
          title: '贷款号',
          dataIndex: 'traceabilityCode',
        }
      ].concat(
        value,
        [
          {
            title: '加黑类型',
            // dataIndex: 'crimeCategory',
            render:(itemValue)=><span>{crimeCategoryToText(itemValue.crimeCategory)}</span>
          },
          {
            title: '备注',
            dataIndex: 'crimeDetails',
          },
          {
            title: '操作人',
            dataIndex: 'collector',
          },
          {
            title: '操作',
            render: (itemValue) => 
              <Button type="danger" 
                size="small"
                onClick={this.delete.bind(this,itemValue)}
              >删除
              </Button>
          }
        ]
      )
    }
    this.companyPhoneListColumns=getColumnsData([
      {
        title: '公司电话',
        dataIndex: 'companyTelephone',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
      }
    ]);
    this.cnidListColumns=getColumnsData([
      {
        title: '姓名',
        dataIndex: 'personalName',
      },
      {
        title: '身份证号',
        dataIndex: 'cnid',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
      }
    ]);
    this.phoneListColumns=getColumnsData([
      {
        title: '姓名',
        dataIndex: 'personalName',
      },
      {
        title: '身份证号',
        dataIndex: 'cnid',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
      },
      {
        title: '关系',
        dataIndex: 'relation',
      }
    ]);

  }
  delete=(value)=>{
    this.setState({
      isShowModal:true,
      toDeleteBlackItem:value
    });
  }
  


  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, formValues) => {
      if (!err) {
        let {blacklistType,blacklistTypeValue} =formValues;
        let params={};
        if(blacklistType==='loanId'){
          params.traceabilityCode= blacklistTypeValue;
          params.traceabilityCodeType= 'loanId';
        }else{
          params.blacklistType=blacklistType;
          params[blacklistTypeValueMap[blacklistType]['key']]=blacklistTypeValue;
        }
        this.savedSearchParams=params;
        this.getList();
        
      }
    });
  }
  getList=(coverParams)=>{
    let params={
      pageSize,
      pageIndex:0,
      ...this.savedSearchParams,
      ...coverParams
    };
    // blacklistType
    axios.get(  'v1/blacklist/query', {
      params
    })
      .then(res=>{
        let resList = res.result.list;
        let phoneLists= [];
        let cnidLists= [];
        let companyNameLists= [];
        let companyPhoneLists= [];
        resList.forEach((value,key)=>{
          value.key=key;
          switch (value.blacklistType) {
            case 'CNID':
              cnidLists.push(value);
              break;
            case 'PHONE_NUMBER':
              phoneLists.push(value);
              break;
            case 'COMPANY_NAME':
              companyNameLists.push(value);
              break;
            case 'COMPANY_TELEPHONE':
              companyPhoneLists.push(value);
              break;
            default:
              break;
          }  
        })
        // console.log({
        //   cnidLists,
        //   phoneLists,
        //   companyNameLists,
        //   companyPhoneLists
        // });
        this.setState({
          cnidLists,
          phoneLists,
          companyNameLists,
          companyPhoneLists
        });  
        if(resList.length == 0){
          // return this.$Message.info('查找不到相关黑名单！');
        }
        
      })
  }
  setModal=(state)=>{
    this.setState({
      isShowModal:state
    });
  }
  componentDidMount(){
    
      
  }
  // 18122016380198586096065
  render(){
    const {
      getFieldDecorator, getFieldsError,validateFieldsAndScroll,
      resetFields
    } = this.props.form;
    const {
      cnidLists,companyPhoneLists,
      phoneLists,companyNameLists,isShowModal,toDeleteBlackItem
    }=this.state;
    
    const searchSelector = getFieldDecorator('blacklistType', {
      initialValue: 'loanId',
    })(
      <Select style={{ width: 110 }}
        onChange={(value)=>{
          resetFields(['blacklistTypeValue']);
          this.searchType=value;
        }}
      >
        <Option value="loanId">贷款号</Option>
        <Option value="PHONE_NUMBER">手机号</Option>
        <Option value="CNID">身份证号</Option>
        <Option value="COMPANY_NAME">公司名称</Option>
        <Option value="COMPANY_TELEPHONE">公司电话</Option>
      </Select>
    );
    return(
      <div className="page_blacklistlist">
        <Card>
          <Form  layout='inline' onSubmit={this.search}>
            <Row gutter={24}>
                <Form.Item
                >
                  {getFieldDecorator('blacklistTypeValue', {
                    rules: [
                      { 
                        validator:(rule, value, callback) => {
                          if (!value) {
                            callback(`请输入${blacklistTypeValueMap[this.searchType].text}`);
                          } else {
                            callback();
                          }
                        }
                      }
                    ],
                  })(
                    <Input style={{width:400}} addonBefore={searchSelector}  />
                  )}
                </Form.Item>
                <Form.Item >
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                  >
                    查询
                  </Button>
                </Form.Item>
              
            </Row> 
          </Form>      
        </Card>
        <br/>
        
        {cnidLists.length>0&&<Fragment>
          <Card title="身份证号加黑">
            <Table
              columns={this.cnidListColumns}
              dataSource={cnidLists}
              // pagination={{
              //   total:total,
              //   pageSize,
              //   onChange:(page, pageSize)=>this.getList({
              //     pageIndex:page,
              //     blacklistType:'CNID'
              //   })
              // }}
              pagination={false}
              bordered size="small"
            /> 
          </Card>
          <br/>
        </Fragment>}
        {phoneLists.length>0&&<Fragment>
          <Card title="手机号加黑">
            <Table
              columns={this.phoneListColumns}
              dataSource={phoneLists}
              pagination={false}
              bordered size="small"
            /> 
          </Card>
          <br/>
        </Fragment>}
        {companyNameLists.length>0&&<Fragment>
          <Card title="公司名称加黑">
            <Table
              columns={this.companyPhoneListColumns}
              dataSource={companyNameLists}
              pagination={false}
              bordered size="small"
            /> 
          </Card>
          <br/>
        </Fragment>}
        {companyPhoneLists.length>0&&<Fragment>  
          <Card title="公司电话加黑">
            <Table
              columns={this.companyPhoneListColumns}
              dataSource={companyPhoneLists}
              pagination={false}
              bordered size="small"
            /> 
          </Card>
        </Fragment>}  
        <ModalInstance
          data={toDeleteBlackItem}
          isShowModal={isShowModal}
          onCancel={this.setModal.bind(this,false)}
          onOkCallback={this.getList.bind(this,{
            // pageIndex:1,
            // blacklistType:toDeleteBlackItem.blacklistType
          })}
        />      
      </div>
    )
  }
}

export default Form.create()(Query)