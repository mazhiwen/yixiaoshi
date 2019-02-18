import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,dataFormat,commonRequest} from 'utils';
import routes from 'routes';
import {ProcessStatus,ResultStatus} from 'configs';

import moment from 'moment';

function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;
class Query extends React.Component{

  constructor(props){
    super(props);
    this.state={
      total:0,
      provinceList:[],
      productList:[],
      receiveList:[
        {
          id: 'yes',
          name: '是'
        },
        {
          id: 'no',
          name: '否'
        },
      ],
      columns:[
        {
          title: '贷款号',
          dataIndex: 'applicationId',
        },
        {
          title: '产品',
          dataIndex: 'productName',
        },
        {
          title: '姓名',
          dataIndex: 'name',
        }, 
        {
          title: '身份证号',
          dataIndex: 'cnid',
        },
        {
          title: '触发时间',
          dataIndex: 'createAt',
          render:value=><span>
            {moment(value).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        },
        {
          title: '处理人',
          dataIndex: 'processName',
        }, 
        {
          title: '处理状态',
          dataIndex: 'processStatus',
          render:value=><span>{ProcessStatus[value]}</span>
        },
        {
          title: '调查结果',
          dataIndex: 'resultStatus',
          render:value=><span>{ResultStatus[value]}</span>
        },  
        // {
        //   title: '状态',
        //   dataIndex: 'state',
        //   render:value=><span>{stateList[value]}</span>
        // }, 
        {
          title: '操作',
          dataIndex: 'serialNo',
          key:'ifprocessName',
          render:(text,record)=>{
            console.log(record);
            if(record.processName){
              return;
            } else {
              
              return (
                <Button 
                  size="small" type="primary"
                  onClick={this.getApplication.bind(this,text)}
                >
                  领取
                </Button>
              )
            }
          }
        }, 
      ],
      data:[]
    };
    this.getListSearchParams={};
  }
  getApplication=(serialNo)=>{
    axios.post(`v1/allot/application/get`,{
      applyTask:{
        serialNo
      }
    })
      .then(res=> {
        
      })
      .finally(()=>{

      })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        
        let params={...values};
        dataFormat.deleteEmpty(params);
        if(params.processStatus==='all'){
          delete params.processStatus;
        }
        if(params.province==='all'){
          delete params.province;
        }
        
        if(params.isAllot==='all'){
          delete params.isAllot;
        }
        if(params.productCode){
          params.productCode=params.productCode.join();
        }
        if(params.times){
          let times=params.times;
          delete params.times;
          params.triggerStart=moment(times[0]).format("YYYY-MM-DD");
          params.triggerEnd=moment(times[1]).format("YYYY-MM-DD");
        }
        this.getListSearchParams=params;
        this.getList(params);
      }
    });
  }
  getList=(pageParams)=>{
    axios.get('v1/application/list',{
      params:{
        size:pageSize,
        page:1,
        ...this.getListSearchParams,
        ...pageParams
      }
    })
      .then(res=> {
        let data=res.result;
        data.forEach((value,index)=>{
          value.key=index+1;
        })
        this.setState({
          data:data,
          total:data.totalElements
        });
      })
      .finally(()=>{

      })
  }
  componentDidMount(){
    // this.getList();
    commonRequest.getApplyProducts()
      .then((productList)=>{
        this.setState({
          productList:Array.concat(
            {
              code: 'all',
              name: '全部'
            },
            productList
          )
        });
      });
    commonRequest.getProvinces()
      .then((res)=>{
        this.setState({
          provinceList:Array.concat(
            {
              provinceCode: 'all',
              provinceName: '全部'
            },
            res
          )
        });
      });
      
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {columns,data,total,productList,
      receiveList,provinceList
    }=this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return(
      <Card>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item label="贷款号">
                {getFieldDecorator('applicationId', {
                })(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            
            <Col span={4}>
              <Form.Item label="手机号">
                {getFieldDecorator('mobile')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="姓名">
                {getFieldDecorator('name')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="联系人手机号">
                {getFieldDecorator('liaisonMobile')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="反欺诈规则编码">
                {getFieldDecorator('ruleCode')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>  
              <Form.Item label="渠道号">
                {getFieldDecorator('origin')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="产品" 
              >
                {getFieldDecorator('productCode')(
                  <Select
                    allowClear={true}
                    mode="multiple"
                  >
                    {productList.map((value,index)=>
                      <Select.Option key={index} value={value.code}>{value.name}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="处理状态" 
              >
                {getFieldDecorator('processStatus',{
                  initialValue:'all'
                })(
                  <Select
                  > 
                    <Select.Option value='all'>全部</Select.Option>
                    {Object.entries(ProcessStatus).map(([index,value])=>
                      <Select.Option key={index} value={index}>{value}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="是否已领取" 
              >
                {getFieldDecorator('isAllot',{
                  initialValue:'all'
                })(
                  <Select
                  > 
                    <Select.Option value='all'>全部</Select.Option>
                    {receiveList.map((value,index)=>
                      <Select.Option key={index} value={value.id}>{value.name}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="省份" 
              >
                {getFieldDecorator('province',{
                  initialValue:'all'
                })(
                  <Select
                  > 
                    {provinceList.map((value,index)=>
                      <Select.Option key={index} value={value.provinceCode}>{value.provinceName}</Select.Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="触发时间" 
              >
                {getFieldDecorator('times')(
                  <DatePicker.RangePicker/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  查询
                </Button>
              </Form.Item>
            </Col> 
          </Row>
        </Form>
        <br/>          
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            // current:total,
            total:total,
            pageSize:pageSize,
            onChange:(page, pageSize)=>this.getList({
              page:page
            })
          }}
          bordered size="small"
          rowSelection={rowSelection}
        />          
      </Card>
    )
  }
}

export default Form.create()(Query)