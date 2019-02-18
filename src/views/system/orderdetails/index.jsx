import * as React from 'react';
import {
  Form, Input, Button, DatePicker,Select,Row,
  Col,Table,Card,Tag
} from 'antd';
import { Link } from 'react-router-dom'

import {axios,utiDate,commonRequest} from 'utils';
import routes from 'routes';
import {stateList} from 'configs';

import moment from 'moment';
const Fragment=React.Fragment;


class OrderDetails extends React.Component{

  constructor(props){
    super(props);
    this.state={
      orderInfo: {
        liaisons: [],
        profile: {},
        company: {},
        detail: {
          apply_product:'apply_product',
          apply_id:'apply_id'
        },
        process_result: {},
        rule_list: [],
        result_texts: [],
      },
      fromQueryStatus:true
    }
  }
  getOrderIfnos(){//获取单据信息
    let id;
    // let name = storageHelper.getItem('userName');
    if(this.$router.currentRoute && this.$router.currentRoute.query){
      id = this.$router.currentRoute.query.id;
      this.orderId = id;
    } else {
      return this.$Message.warning('出现了未知错误！');
    }
    // let params = '?id=' + id + '&name=' + name;
    let params = '?id=' + id;
    
    this.$Loading.start();
    axios.get( 'Domain-rulengine/v1/process/apply/info' + params)
    .then(res=>{
      if(res.message == 'ok'){
        //初始化，解决存在缓存的问题。目前对缓存的处理还没找到更好地方法
        //  this.orderInfo= {
        //   liaisons: [],
        //   profile: {},
        //   company: {},
        //   detail: {},
        //   process_result: {},
        //   rule_list: [],
        //   result_texts: [],
        // };
        //规则
        let ruleLists = res.result.rule_list;
        //电话记录
        let telephoneRecords = res.result.result_texts;

        this.orderInfo = JSON.stringify(res.result.apply_info) !='{}' ? res.result.apply_info : this.orderInfo;

        //是否本人领取
        if(!res.result.is_owner){
          this.fromQueryStatus = false;
        }
        //规则列表
        this.ruleList = [];
        this.ruleList = (ruleLists && ruleLists.length >0) ? ruleLists : this.ruleList;
        this.hangUpStatus = res.result.hang_up;
        this.blackAddStatus = res.result.add_black;
        let processResult = {};
        processResult = res.result.process_result;
        // if(this.hangUpStatus){
        //   this.fromQueryStatus = false;
        // }
        this.processStatus = res.result.process_status;

        // console.log(ruleLists,  this.ruleList);
        
        //调查结果
        if(processResult){
          if(processResult.result_status !== undefined){

            this.codeId = processResult.result_status === 0 ? 1 : processResult.result_status;
            switch (processResult.result_status) {
            case 2:
              if(processResult.result_txt){
                this.resultText = processResult.result_txt;
              }
              break;
            case 3:
              if(processResult.result_txt){
                this.cheatText = processResult.result_txt;
              }
              if(processResult.rc_list && processResult.rc_list.length >0){
                this.tags = [];
                this.causeFraud = '';
                processResult.rc_list.forEach(element => {
                  this.causeFraud += ' ' + element.name;
                  this.tags.push(element.name);
                });
              }
              break;
            default:
              break;
          }
          }
        }

        // console.log(processResult.rc_list, this.tags);
        //电话记录
        if(telephoneRecords && telephoneRecords.length > 0){
          let arrs = [];
          let ts = this;
          arrs = telephoneRecords;
          this.phoneRecordes = [];
          for(let i=0; i< arrs.length; i++){
            this.phoneRecordes.push({
              callTime: ts.formatDate(arrs[i].callTime),
              txt: arrs[i].resultTxt,
              status: true,
            });
          }
        }
        // console.log(telephoneRecords, this.phoneRecordes);
        //初始化
        this.approvalInfo = {
            documents: [],
            educations: [],
            approvalHistories: [],
            creditLine: {},
            wedefendApproval: {},
            customerTips: [],
            riskCheck: {
              isRiskIndustry: false,
              isSelfPhone: true,
              isSamePhoneModel: true
            }
          };
        //电话调查
        this.companyRecordArrs= {
                    net: [],
                    pengyuan: [],
                    yiyisi: [],
                    company: [],
                  };
        if(res.result.approval_info && res.result.approval_info.status == 200){
           this.approvalInfo = JSON.stringify(res.result.approval_info.data) !='{}' ?  res.result.approval_info.data : {};
           this.approvalInfo.creditLine = this.approvalInfo.creditLine ? this.approvalInfo.creditLine : {};
           //一些字段处理-- 本次机审结论
           if(this.approvalInfo.wedefendApproval && this.approvalInfo.wedefendApproval.operation){
             this.approvalInfo.wedefendApproval.operationName = this.wedefendApprovalObj.hasOwnProperty(this.approvalInfo.wedefendApproval.operation) ? this.wedefendApprovalObj[this.approvalInfo.wedefendApproval.operation] : '';
           }
           if(this.approvalInfo.riskCheck == null){
             this.approvalInfo.riskCheck = {
                isRiskIndustry: false,
                isSelfPhone: true,
                isSamePhoneModel: true
             };
           }
          //教育时间转换
          if(this.approvalInfo.educations && this.approvalInfo.educations.length > 0){
            let ts = this;
            this.approvalInfo.educations.forEach(element => {
              if(element.enrolledAt){
                element.enrolledTime = ts.formatDate(element.enrolledAt);
              }
              if(element.graduatedAt){
                element.graduatedTime = ts.formatDate(element.graduatedAt);
              }
              element.location = element.address.description
            });
          }
          
          if(this.approvalInfo.companyRecords && this.approvalInfo.companyRecords !== null && this.approvalInfo.companyRecords.length > 0){
            
            this.approvalInfo.companyRecords.forEach(element => {
              if(element.type == 'net'){
                this.companyRecordArrs.net = element.records;
                
              } else if(element.type == 'pengyuan'){
                this.companyRecordArrs.pengyuan = element.records;
                
              } else if(element.type == '114'){
                this.companyRecordArrs.yiyisi = element.records;
              } else if(element.type == 'company'){
                this.companyRecordArrs.company = element.records;
              }
            });
          }
        }
        
        this.approvalInfo.liaisonRecords = this.approvalInfo.liaisonRecords ? this.approvalInfo.liaisonRecords : [];
        if(this.approvalInfo.liaisonRecords.length > 0){
          for(let i=0; i< this.approvalInfo.liaisonRecords.length; i++){
            this.approvalInfo.liaisonRecords[i].relationshipCname = '';
            for(let j = 0; j < this.relationships.length; j++){
              if(this.approvalInfo.liaisonRecords[i].relationship == this.relationships[j].value){
                this.approvalInfo.liaisonRecords[i].relationshipCname = this.relationships[j].name;
                break;
              }
            }
            
          }
         
        }
      } else {
        this.$Message.info(res.message);
      }
      
      this.$Loading.finish();
    })
    .catch(err=>{
      this.$Loading.error();
    })
  }
  testOrder(){
    let id = '';
    let rmaitId = '';
    id = (this.$router.currentRoute.query.taskId !== '' && this.$router.currentRoute.query.taskId !== undefined) ? this.$router.currentRoute.query.taskId : '';
    rmaitId = (this.$router.currentRoute.query.rmaitId !== '' && this.$router.currentRoute.query.rmaitId !== undefined) ? this.$router.currentRoute.query.rmaitId : '';
    let url = '';
    if(this.$router.currentRoute.query.relatedStatus){
      url = 'Domain-rulengine/v1/test/apply/info?taskId='+ id +'&rmrrtId=' + rmaitId;//关联单据接口
    } else {
      url = 'Domain-rulengine/v1/test/apply/info?taskId='+ id +'&rmaitId=' + rmaitId;//测试单据接口
    }
    this.$Loading.start();
    axios.get( url)
    .then(res=>{
      if(res.message == 'ok'){
        this.fromQueryStatus = false;

        this.orderInfo= {
          liaisons: [],
          profile: {},
          company: {},
          detail: {},
          process_result: {},
          rule_list: [],
          result_texts: [],
        };
        //规则
        let ruleLists = res.result.rule_list;

        //规则列表
        this.ruleList = [];
        this.ruleList = (ruleLists && ruleLists.length >0) ? ruleLists : this.ruleList;
        this.hangUpStatus = res.result.hang_up;
        this.blackAddStatus = res.result.add_black;

        //初始化
        this.approvalInfo = {
            documents: [],
            educations: [],
            approvalHistories: [],
            creditLine: {},
            wedefendApproval: {},
            customerTips: [],
            riskCheck: {
              isRiskIndustry: false,
              isSelfPhone: true,
              isSamePhoneModel: true
            }
          };
        //电话调查
        this.companyRecordArrs= {
                    net: [],
                    pengyuan: [],
                    yiyisi: [],
                    company: [],
                  };
        if(res.result.approval_info && res.result.approval_info.status == 200){
           this.approvalInfo = JSON.stringify(res.result.approval_info.data) !='{}' ?  res.result.approval_info.data : {};
           this.approvalInfo.creditLine = this.approvalInfo.creditLine ? this.approvalInfo.creditLine : {};
           //一些字段处理-- 本次机审结论
           if(this.approvalInfo.wedefendApproval && this.approvalInfo.wedefendApproval.operation){
             this.approvalInfo.wedefendApproval.operationName = this.wedefendApprovalObj.hasOwnProperty(this.approvalInfo.wedefendApproval.operation) ? this.wedefendApprovalObj[this.approvalInfo.wedefendApproval.operation] : '';
           }
           if(this.approvalInfo.riskCheck == null){
             this.approvalInfo.riskCheck = {
                isRiskIndustry: false,
                isSelfPhone: true,
                isSamePhoneModel: true
             };
           }
          //教育时间转换
          if(this.approvalInfo.educations && this.approvalInfo.educations.length > 0){
            let ts = this;
            this.approvalInfo.educations.forEach(element => {
              if(element.enrolledAt){
                element.enrolledTime = ts.formatDate(element.enrolledAt);
              }
              if(element.graduatedAt){
                element.graduatedTime = ts.formatDate(element.graduatedAt);
              }
              element.location = element.address.description
            });
          }
          
          if(this.approvalInfo.companyRecords && this.approvalInfo.companyRecords !== null && this.approvalInfo.companyRecords.length > 0){
            
            this.approvalInfo.companyRecords.forEach(element => {
              if(element.type == 'net'){
                this.companyRecordArrs.net = element.records;
                
              } else if(element.type == 'pengyuan'){
                this.companyRecordArrs.pengyuan = element.records;
                
              } else if(element.type == '114'){
                this.companyRecordArrs.yiyisi = element.records;
              } else if(element.type == 'company'){
                this.companyRecordArrs.company = element.records;
              }
            });
          }
        }
        
        this.approvalInfo.liaisonRecords = this.approvalInfo.liaisonRecords ? this.approvalInfo.liaisonRecords : [];
        if(this.approvalInfo.liaisonRecords.length > 0){
          for(let i=0; i< this.approvalInfo.liaisonRecords.length; i++){
            this.approvalInfo.liaisonRecords[i].relationshipCname = '';
            for(let j = 0; j < this.relationships.length; j++){
              if(this.approvalInfo.liaisonRecords[i].relationship == this.relationships[j].value){
                this.approvalInfo.liaisonRecords[i].relationshipCname = this.relationships[j].name;
                break;
              }
            }
            
          }
         
        }
        
      } else {
        this.$Message.info(res.message);
      }
      
      this.$Loading.finish();
    })
    .catch(err=>{
      this.$Loading.error();
    })
    

  }
  render(){
    const {orderInfo,fromQueryStatus}= this.state;
    return (
      <div>
        <Card>
          <Row gutter={16}>
            <Col span={12}>
              <h3>{orderInfo.detail.apply_product}</h3>
              <h3>{orderInfo.detail.apply_id}</h3>
              {fromQueryStatus&&
              <Fragment>
                <Tag color="#f50">待处理</Tag>
                <Tag color="#2db7f5">#2db7f5</Tag>
                <Tag color="#87d068">#87d068</Tag>
                <Tag color="#108ee9">#108ee9</Tag>
              </Fragment>
              }
            </Col>
            <Col span={12}>
              
            </Col>
          </Row>

        </Card>

      </div>  
    )
  }
}


export default Form.create()(OrderDetails)