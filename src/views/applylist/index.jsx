import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,utiDate} from 'utils';
import routes from 'routes';
import {stateList} from 'configs';

import moment from 'moment';


function hasErrors(fieldsError) {  
  return Object.keys(fieldsError).some(value => fieldsError[value]);
}
const pageSize=15;
class ComponentInstance extends React.Component{

  constructor(props){
    super(props);
    this.state={
      total:0,
      columns:[
        {
          title: '序号',
          dataIndex: 'key',
          // render: text => <a href="javascript:;">{text}</a>,
        }, 
        {
          title: '状态',
          dataIndex: 'state',
          render:value=><span>{stateList[value]}</span>
        }, 
        {
          title: '申请号',
          dataIndex: 'id',
          render:value=><Link 
                          target="_blank" 
                          to={{pathname:`${routes.applydetail.base}/${value}`}}
                        >
                          {value}
                        </Link>
        },
        {
          title: '产品',
          dataIndex: 'productName',
        }, 
        {
          title: '姓名',
          dataIndex: 'data.proposer.name',
        }, 
        {
          title: '身份证号',
          dataIndex: 'data.proposer.cnid',
        },
        {
          title: '申请时间',
          dataIndex: 'appliedAt',
          render:value=><span>{utiDate.toDateTime(value)}</span>
        }, 
        {
          title: '标签',
          dataIndex: 'labels',
        },
        {
          title: '额度',
          dataIndex: 'amount',
        }, 
        {
          title: '审核者',
          dataIndex: 'approver.operator',
        }
      ],
      data:[]
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        if(values.startDate){
          values.startDate=moment(values.startDate).format("YYYY-MM-DD");
        }
        if(values.endDate){
          values.endDate=moment(values.endDate).format("YYYY-MM-DD");
        }
        this.getList(values);
      }
    });
  }
  getList=(values)=>{
    axios.get('v1/application/list',{
      params:{
        approvalType:'all',
        size:pageSize,
        start:1,
        ...values
      }
    })
      .then(res=> {
        let data=res.data;
        let dataContent=data.content;
        dataContent.forEach((value,index)=>{
          value.key=index+1;
        })
        this.setState({
          data:dataContent,
          total:data.totalElements
        });
      })
      .finally(()=>{

      })
  }
  componentDidMount(){
    this.getList();
  }
  render(){
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    const {columns,data,total}=this.state;
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
              <Form.Item label="公司名">
                {getFieldDecorator('company')(
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
              <Form.Item label="身份证号">
                {getFieldDecorator('cnid')(
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
          </Row>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item label="申请时间(起始)" >
                {getFieldDecorator('startDate')(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="申请时间(结束)" >
                {getFieldDecorator('endDate')(
                  <DatePicker />
                )}
              </Form.Item>          
            </Col>      
            <Col span={4}>
              <Form.Item label="审核者">
                {getFieldDecorator('operator')(
                  <Input/>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="申请状态" 
              >
                {getFieldDecorator('state')(
                  <Select
                    // onChange={this.handleSelectChange}
                  >
                    {Object.entries(stateList).map(([index,value])=>
                      <Select.Option key={index} value={index}>{value}</Select.Option>
                    )}
                  </Select>
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

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            // current:total,
            total:total,
            pageSize:pageSize,
            onChange:(page, pageSize)=>this.getList({
              start:page
            })
          }}
          bordered size="small"
        />          
      </Card>
    )
  }
}

export default Form.create()(ComponentInstance)