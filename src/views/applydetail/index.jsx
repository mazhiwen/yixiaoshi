import * as React from 'react';
import {
  Form,Row,
  Col,Anchor,Card,Badge,List,
} from 'antd';
import {axios,utiDate,parseOperatorName} from 'utils';

import VerifyOperation from './VerifyOperation';
import PhoneRecord from './PhoneRecord';
import Documents from './Documents';


const ListItem = List.Item;


const TextBadge=(props)=>{
  const config={
    'success':{
      color:'#5cb85c'
    },
    default:{
      color:'#5bc0de'
    },
    warning:{
      color:'red'
    },
    primary:{
      color:'rgb(94, 135, 176)'
    }
  }
  return (
    <span  
      style={{
        backgroundColor:props.type?config[props.type].color:config['default'].color
      }}
      className="text_badge"
    >
      {props.text}
    </span>
  )
}
class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id:props.match.params.id,
      basicInfo:'',
      liaisons:[],
      educations:[],
      cardInfo:{},
      riskInfo:'',
      externalPlatformLoans:{},
      loanDetail:{},
      applyInfo:{},
      houseFundReport:{},
      socialReport:{},
      contactsData:{
      },
      operatorInfo:{},
      smsInfo:[],
      reasons:[],
      applyData:{},
      flag:{},
      submited:'',
      wraprightFixedStyle:{},
      wraprightStyle:{},
      documents:[]
    };
    this.wraprightDOM=React.createRef();
    
  }
  documentFileChange=(fileList)=>{
    this.setState({
      documents:fileList
    });
  }

  getWedefend=()=> {
    axios.get('applications/'+this.state.id+'/risk/report').then( (res)=> {
      let personalSummaryReport = res.data.personalSummaryReport;
      // openAssignModal = openAssignModal;
      let nfcsReport=personalSummaryReport.nfcsReport.result;
      this.setState({
        basicInfo:personalSummaryReport.basicInfo,
        liaisons:personalSummaryReport.contactsInfo.liaisons,
        educations:personalSummaryReport.educationInfo.educations,
        // riskInfo:personalSummaryReport.riskInfo,
        riskInfo:{
          company:22
        },
        externalPlatformLoans:personalSummaryReport.externalPlatformLoans,
        rulesResult:personalSummaryReport.rulesResult,
        reasons:personalSummaryReport.rulesResult.reasons,
        houseFundReport:personalSummaryReport.houseFundReport,
        socialReport:personalSummaryReport.socialReport,
        origin:personalSummaryReport.origin,
        hangZhouInfo:personalSummaryReport.hangZhouInfo,
        nfcsReport:nfcsReport,
        operatorInfo:personalSummaryReport.operatorInfo,
        cardInfo:personalSummaryReport.cardInfo,
        smsInfo:personalSummaryReport.sdkInfo.smsInfo
      });
      if(nfcsReport&&nfcsReport["贷款交易信息"]){
        this.setState({
          applyInfo : nfcsReport["贷款交易信息"]["贷款"],
          loanDetail : nfcsReport["贷款交易信息"]["信息概要"]
        });    
      }
      let contactsData={};
      let topContactNumbers = personalSummaryReport.topContactNumbers;
      if (topContactNumbers.length>0) {
        contactsData.directContact = topContactNumbers.length && topContactNumbers.filter(function(contact) {
          return contact.type === "direct"
        })
        contactsData.oftenContact = topContactNumbers.length && topContactNumbers.filter(function(contact) {
          return contact.type === "often"
        })
        contactsData.oftenedContact = topContactNumbers.length && topContactNumbers.filter(function(contact) {
          return contact.type === "oftened"
        })
        contactsData.durationContact = topContactNumbers.length && topContactNumbers.filter(function(contact) {
          return contact.type === "duration"
        })
        contactsData.durationedContact = topContactNumbers.length && topContactNumbers.filter(function(contact) {
          return contact.type === "durationed"
        })
      }
      this.setState({
        contactsData
      }); 
      
    })
  }
  getPrefixText=(applyData)=>{
    var origin = applyData.origin;
    var source_id = applyData.sourceId
    if(origin&&origin.length>0){
      return '('+origin+')'
    }else
      return this.getSourceName(source_id)
  }
  getSourceName=(source_id)=>{
    if(source_id===1||source_id===3){
      return '(APP)'
    }else if(source_id ===2){
      return '(H5)'
    }else{
      return ''
    }
  }
  getFlag=(data)=> {
    var state = data.state;
    var operation = data.operation;
    return {
      isEditable: data.edit,
      isEnableRepeal: data.repeal,
      isSuspended: data.suspended,
      isOnPreApprove: operation && operation.step==='pre',
      isOnInitApprove: operation && operation.step==='init',
      isOnFinalApprove: operation && operation.step==='final',
      isOnFraudApprove: operation && operation.step==='fraud',
      isOnWedefendApprove: data.step==='wedefend' && state==='applied',
      isIndividualBusiness: this.isIndividualBusiness(data)
    }
  }
  isIndividualBusiness= (data)=> {
    var origin = data.origin;
    var code = data.productCode;
    return (this.isIndividualBusinessCode(code) && origin === 'sc_prm_dlb_00000001') ||
      (this.isIndividualBusinessCode(code) && origin === 'sc_prm_sbs_00000001')
  }
  isIndividualBusinessCode= (code) =>{
    return /^H5-SDD/i.test(code)
  }
  getApply=()=>{
    axios.get('applications/'+this.state.id).then( (res)=> {
      let applyData = res.data;
      applyData.productName=this.getPrefixText(applyData)+applyData.productName ;
      let flag = this.getFlag(applyData);
      flag.isEditable = true;
      flag.isSuspended = false;
      let submited = false;
      let {documents}=applyData;
      this.setState({
        applyData,
        flag,
        submited,
        documents
      }); 
    })
  }
  scrollEventHandler=(event)=>{
    const scrollTop = (event.srcElement ? 
      event.srcElement.documentElement.scrollTop 
      : false) 
      || window.pageYOffset 
      || (event.srcElement ? event.srcElement.body.scrollTop : 0);
    if(scrollTop>=290){
      this.setState({
        wraprightStyle:this.state.wraprightFixedStyle
      })
    }else{
      this.setState({
        wraprightStyle:{}
      })
    }
  }

  componentDidMount(){
    this.getWedefend();
    this.getApply();
    window.addEventListener('scroll', this.scrollEventHandler);
    // setTimeout(()=>{
      
    // },3000)
    // let {offsetLeft,clientWidth}=this.wraprightDOM.current;
    //熟值是精确计算屏幕宽度- 各种边框的 宽度
    let lefta=(document.body.clientWidth-200-20-64)*0.51;
    let width=(document.body.clientWidth-200-20-64)*0.49;
    let left=200+10+32+lefta;
    this.setState({
      wraprightFixedStyle:{
        position: 'fixed',
        left: left,
        width: width,
        top: 46,
        height:window.innerHeight-80
      }
    })
    
  }
  // componentWillUnmount = () => {
  //   this.setState = (state,callback)=>{
  //     return;
  //   };
  // }
  componentDidUpdate(){
  }
  render(){
    const {
      basicInfo,liaisons,educations,cardInfo,riskInfo,
      externalPlatformLoans,loanDetail,applyInfo,houseFundReport,
      socialReport,contactsData,operatorInfo,reasons,
      applyData,id,wraprightStyle,documents,flag
    }=this.state;
    const ReportTitleItem=(props)=>(
      <div className="report_titleitem">
        <span>{props.title}</span>
        <span>{props.value}</span>
      </div>
    )
    return(
      <div className="page_applydetail">
        <Card>
          <div>
            <strong>{applyData.productName}</strong>
            <strong>{applyData.applicationId}</strong>
            <TextBadge type="success" text={'￥'+applyData.amount}/>
            <TextBadge type="success" text={applyData.tenor}/>
            <TextBadge type="success" text={applyData.approvalNote}/>
          </div>
          <div>
            <TextBadge text={applyData.stateDesc}/>
            {flag.isOnWedefendApprove&&<TextBadge type="warning" text='wedefend审核中'/>}

          </div>
        </Card>
        <Card>
          <Card.Meta
            className="report_titlebox"
            title=
            {
              <div className="reporttitle">
                <h1>初审报告</h1>
                <h3 className="reportresult">系统转人工</h3>
              </div>
            }
            description={
              <Row 
                // gutter={16} 
                type="flex" 
                justify="space-around" 
              >
                <Col span={4}>
                  <ReportTitleItem title="建议额度（元）" value="8000"/>
                </Col>
                <Col span={4}>
                  <ReportTitleItem title="建议期限（月）" value="8000"/>
                </Col>
                <Col span={4}>
                  <ReportTitleItem title="客户评级" value="8000"/>
                </Col>
                <Col span={4}>
                  <ReportTitleItem title="我来分" value="8000"/>
                </Col>
              </Row>
            }
          />
          <Anchor 
            className="repot_btn"
            bounds={100}
            >
            <Anchor.Link href="#card1" title="基本信息"/>
            <Anchor.Link href="#card2" title="紧急联系人" />
            <Anchor.Link href="#card3" title="学历"/>
            <Anchor.Link href="#card4" title="风控数据"/>
            <Anchor.Link href="#card5" title="证明文件" />
            <Anchor.Link href="#card6" title="短信"/>
            <Anchor.Link href="#card7" title="风险提示"/>
          </Anchor>
          <div className="details_wrap">

            <div className="details_wrapleft">

              <div className="offsetcard tablecard" id="card1">
                <Card
                  type="inner"
                  title="基本信息"
                  hoverable={true}
                >
                  <table className="gird-table ">
                    <tbody>
                      <tr>
                        <th>姓名</th>
                        <td>{basicInfo.name}</td>
                        <th>性别</th>
                        <td>{basicInfo.gender}</td>
                      </tr>
                      <tr>
                        <th>出生日期</th>
                        <td>{basicInfo.birth}</td>
                        <th>证件号</th>
                        <td>{basicInfo.cnid}</td>
                      </tr>
                      <tr>
                        <th>手机号码</th>
                        <td>{basicInfo.account}</td>
                        <th>手机在网时长(月)</th>
                        <td>{basicInfo.mobileInNetTime}</td>
                      </tr>
                      <tr>
                        <th>年龄</th>
                        <td>{basicInfo.age}</td>
                        <th>申请日期</th>
                        <td>{basicInfo.applied_at}</td>
                      </tr>
                      <tr>
                        <th>个人住址</th>
                        <td>{basicInfo.residentAddress}</td>
                        <th>入职时间</th>
                        <td>{basicInfo.entry_time}</td>
                      </tr>
                      <tr>
                        <th>单位名称</th>
                        <td>{basicInfo.companyName}</td>
                        <th>职业</th>
                        <td>{basicInfo.position}</td>
                      </tr>
                      <tr>
                        <th>单位电话</th>
                        <td>{basicInfo.companyTel}</td>
                        <th>行业</th>
                        <td>{basicInfo.industry}</td>
                      </tr>
                      <tr>
                        <th>单位地址</th>
                        <td>{basicInfo.companyAddr}</td>
                        <th></th>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard" id="card2">
                <Card
                  type="inner"
                  title="紧急联系人"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th>关系</th>
                        <th>姓名</th>
                        <th>手机号</th>
                        <th>是否在通讯录</th>
                        <th>通讯录称呼</th>
                      </tr>
                      {
                        liaisons.map((value,index)=>(
                          <tr key={index}>
                            <td>{value.relationship }</td>
                            <td>{ value.name }</td>
                            <td>{ value.mobile }</td>
                            <td>{ value.isInPhonebook }</td>
                            <td>{value.nickNameInPhonebook}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard" id="card3">
                <Card
                  type="inner"
                  title="学历"
                >
                  {
                    educations.map((value,index)=>(
                      <table key={index} className="gird-table">
                        <tbody>
                        <tr>
                          <th>毕业院校</th>
                          <td>{value.college }</td>
                          <th>毕业时间</th>
                          <td>{value.graduateTime }</td>
                        </tr>
                        <tr>
                          <th>院校所在地</th>
                          <td>{value.address }</td>
                          <th>专业名称</th>
                          <td>{value.specialty }</td>
                        </tr>
                        <tr>
                          <th>学历类别</th>
                          <td>{value.studyType }</td>
                          <th>学历层次</th>
                          <td>{value.degree }</td>
                        </tr>
                        <tr>
                          <th>学习形式</th>
                          <td>{value.studyStyle }</td>
                          <th>毕结业结论</th>
                          <td>{value.studyResult }</td>
                        </tr>
                        </tbody>
                      </table>
                    ))
                  }
                </Card>
              </div>
              <div className="offsetcard" id="card4">
                <Card
                  type="inner"
                  title="风险排查"
                >
                  <table className="gird-table table_nothwidth">
                    <tbody>
                      <tr>
                        <th>类别</th>
                        <th>结果</th>
                        <th colSpan="2">特别标示/核查结果</th>
                      </tr>
                      <tr >
                        <td >身份验证</td>
                        <td>{basicInfo.identityCheck }</td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td >通讯录匹配贷款联系人、贷款公司</td>
                        <td>{riskInfo.phonebookLoanInfo && riskInfo.phonebookLoanInfo.result }</td>
                        <td colSpan="2">{riskInfo.phonebookLoanInfo && riskInfo.phonebookLoanInfo.remark }</td>
                      </tr>
                      <tr>
                        <td >短信命中高风险关键字</td>
                        <td>{riskInfo.smsHitRiskKeywords && riskInfo.smsHitRiskKeywords.result }</td>
                        <td colSpan="2">{riskInfo.smsHitRiskKeywords && riskInfo.smsHitRiskKeywords.remark }</td>
                      </tr>
                      <tr>
                        <td >设备风险识别</td>
                        <td>{riskInfo.deviceRisk && riskInfo.deviceRisk.result }</td>
                        <td colSpan="2">{riskInfo.deviceRisk &&  riskInfo.deviceRisk.remark }</td>
                      </tr>
                      <tr>
                        <td >手机号风险识别</td>
                        <td>{riskInfo.phoneRisk && riskInfo.phoneRisk.result }</td>
                        <td colSpan="2">{riskInfo.phoneRisk && riskInfo.phoneRisk.remark }</td>
                      </tr>
                      <tr>
                        <td >多人同WIFI申请</td>
                        <td>{riskInfo.someWifiApply && riskInfo.someWifiApply.result }</td>
                        <td colSpan="2">{riskInfo.someWifiApply && riskInfo.someWifiApply.remark }</td>
                      </tr>
                      <tr>
                        <td >多人同GPS申请</td>
                        <td>{riskInfo.someGpsApply && riskInfo.someGpsApply.result }</td>
                        <td colSpan="2">{riskInfo.someGpsApply && riskInfo.someGpsApply.remark }</td>
                      </tr>
                      <tr>
                        <td >GPS与居住(家庭/当前/学校)地址匹配</td>
                        {/* <td>{riskInfo.addrCheck && riskInfo.addrCheck.gpsCheckWithAddr.result | formatBoolean}</td> */}
                        <td></td>
                        <td colSpan="2"></td>
                      </tr>
                      <tr>
                        <td >手机归属地与居住(家庭/当前/学校)地址匹配</td>
                        {/* <td>{riskInfo.addrCheck && riskInfo.addrCheck.phoneBelongCheckWithAddr.result | formatBoolean}</td> */}
                        <td></td>
                        <td colSpan="2"></td>
                      </tr>

                      <tr >
                        <td >不良征信历史（近半年逾期）</td>
                        <td>{riskInfo.badCreditHistory ? riskInfo.badCreditHistory.result : null }</td>
                        <td colSpan="2">{riskInfo.badCreditHistory ? riskInfo.badCreditHistory.remark : null }</td>
                      </tr>
                      <tr >
                        <td >信用卡逾期（近一年）</td>
                        <td>{ (riskInfo.creditCardInfo && riskInfo.creditCardInfo.overdueCnt>0)?'是':'否' }</td>
                        <td colSpan="2">{riskInfo.creditCardInfo ? riskInfo.creditCardInfo.overdueCnt: null }</td>
                      </tr>
                      <tr >
                        <td >信用卡取现</td>
                        <td>3个月</td>
                        <td>6个月</td>
                        <td>12个月</td>
                      </tr>
                      <tr >
                        <td>次数</td>
                        <td>{cardInfo.cashTimesIn3Months }</td>
                        <td>{cardInfo.cashTimesIn6Months }</td>
                        <td>{cardInfo.cashTimesIn12Months }</td>
                      </tr>
                      <tr >
                        <td>金额</td>
                        <td>{cardInfo.cashAmountIn3Months }</td>
                        <td>{cardInfo.cashAmountIn6Months }</td>
                        <td>{cardInfo.cashAmountIn12Months }</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="黑名单"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr >
                        <th>内部黑名单</th>
                        <th>结果</th>
                        <th>特别标示/核查结果</th>
                      </tr>
                      <tr>
                        <th>身份证命中黑名单</th>
                        <td>{riskInfo.isCnidInBlackList ? riskInfo.isCnidInBlackList.result : null }</td>
                        <td>{riskInfo.isCnidInBlackList ? riskInfo.isCnidInBlackList.remark : null }</td>
                      </tr>
                      <tr>
                        <th>手机号码命中黑名单</th>
                        <td>{riskInfo.isMobileInBlackList ? riskInfo.isMobileInBlackList.result : null }</td>
                        <td>{riskInfo.isMobileInBlackList ? riskInfo.isMobileInBlackList.remark : null }</td>
                      </tr>
                      <tr>
                        <th>工作单位命中黑名单</th>
                        <td>{riskInfo.isCompanyInBlackList ? riskInfo.isCompanyInBlackList.result : null }</td>
                        <td>{riskInfo.isCompanyInBlackList ? riskInfo.isCompanyInBlackList.remark : null }</td>
                      </tr>
                      <tr>
                        <th>联系人命中黑名单</th>
                        <td>{ (liaisons && liaisons.length) ? liaisons[0].isHitBlacklist : '' }</td>
                        <td></td>
                      </tr>
                      <tr >
                        <th>外部黑名单</th>
                        <th>结果</th>
                        <th>特别标示/核查结果</th>
                      </tr>
                      <tr>
                        <th>司法类</th>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.judicialResult : null }</td>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.judicialRemark : null }</td>
                      </tr>
                      <tr>
                        <th>信贷逾期类</th>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.creditOverdueResult : null }</td>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.creditOverdueRemark : null }</td>
                      </tr>
                      <tr>
                        <th>其他黑名单</th>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.otherResult : null }</td>
                        <td>{riskInfo.isInExternalBlackList ? riskInfo.isInExternalBlackList.otherRemark : null }</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="多机构借贷"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th></th>
                        <th>结果</th>
                        <th>风险等级</th>
                      </tr>
                      <tr>
                        <th>七天内多机构借贷申请（手机号/身份证）</th>
                        <td>{externalPlatformLoans.fmD7CellLoanCnt }/{externalPlatformLoans.fmD7CnidLoanCnt }</td>
                        <td>{externalPlatformLoans.fmD7CellLoanCnt > 20 || externalPlatformLoans.fmD7CnidLoanCnt > 20 ? '高' : null }</td>
                      </tr>
                      <tr>
                        <th>一个月内多机构借贷申请（手机号/身份证）</th>
                        <td>{externalPlatformLoans.fmM1CellLoanCnt }/{externalPlatformLoans.fmM1CnidLoanCnt }</td>
                        <td>{externalPlatformLoans.fmM1CellLoanCnt > 20 || externalPlatformLoans.fmM1CnidLoanCnt > 20 ? '高' : null }</td>
                      </tr>
                      <tr>
                        <th>三个月内多机构借贷申请（手机号/身份证）</th>
                        <td>{externalPlatformLoans.fmM3CellLoanCnt }/{externalPlatformLoans.fmM3CnidLoanCnt }</td>
                        <td>{externalPlatformLoans.fmM3CellLoanCnt > 20 || externalPlatformLoans.fmM1CnidLoanCnt > 20 ? '高' : null }</td>
                      </tr>
                      <tr>
                        <th>七天内多机构借贷申请（设备号）</th>
                        <td>{externalPlatformLoans.fmD7DeviceLoanCnt }</td>
                        <td>{externalPlatformLoans.fmD7DeviceLoanCnt > 20 ? '高' : null}</td>
                      </tr>
                      <tr>
                        <th>一个月内多机构借贷申请（设备号）</th>
                        <td>{externalPlatformLoans.fmM1DeviceLoanCnt }</td>
                        <td>{externalPlatformLoans.fmM1DeviceLoanCnt > 20 ? '高' : null }</td>
                      </tr>
                      <tr>
                        <th>三个月内多机构借贷申请（设备号）</th>
                        <td>{externalPlatformLoans.fmM3DeviceLoanCnt }</td>
                        <td>{externalPlatformLoans.fmM3DeviceLoanCnt > 20 ? '高' : null }</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="贷款信息概要"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th>贷款笔数</th>
                        <td>{loanDetail["贷款笔数"]}</td>
                        <th>最大授信额度</th>
                        <td>{loanDetail["最大授信额度"]}</td>
                      </tr>
                      <tr>
                        <th>贷款总额</th>
                        <td>{loanDetail["贷款总额"]}</td>
                        <th>贷款余额</th>
                        <td>{loanDetail["贷款余额"]}</td>
                      </tr>
                      <tr>
                        <th>月还款</th>
                        <td>{loanDetail["协定月还款"]}</td>
                        <th>当期逾期总额</th>
                        <td>{loanDetail["当前逾期总额"]}</td>
                      </tr>
                      <tr>
                        <th>最高逾期金额</th>
                        <td>{loanDetail["最高逾期金额"]}</td>
                        <th>最高逾期期数</th>
                        <td>{loanDetail["最高逾期期数"]}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="贷款信息明细"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th>贷款机构</th>
                        <td>{applyInfo["机构名称"]}</td>
                        <th>发放日期</th>
                        <td>{applyInfo["开户日期"]}</td>
                      </tr>
                      <tr>
                        <th>贷款类型</th>
                        <td>{applyInfo["贷款项目"]}</td>
                        <th>贷款金额</th>
                        <td>{applyInfo["授信额度"]}</td>
                      </tr>
                      <tr>
                        <th>剩余贷款期限</th>
                        <td>{applyInfo["剩余还款月数"]}</td>
                        <th>月还款</th>
                        <td>{applyInfo["本月应还款金额"]}</td>
                      </tr>
                      <tr>
                        <th>发生地</th>
                        <td>{applyInfo["发生地"]}</td>
                        <th>担保方式</th>
                        <td>{applyInfo["担保方式"]}</td>
                      </tr>
                      <tr>
                        <th>账户状态</th>
                        <td>{applyInfo["帐户状态"]}</td>
                        <th>当前逾期期数</th>
                        <td>{applyInfo["当前逾期期数"]}</td>
                      </tr>
                      <tr>
                        <th>当前逾期金额</th>
                        <td>{applyInfo["当前逾期总额"]}</td>
                        <th>24个月还款状态</th>
                        <td>{applyInfo["二十四月内各月还款状况"]}</td>
                      </tr>

                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="公积金"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <td>姓名</td>
                        <td>{houseFundReport.name}</td>
                        <td>缴存基数</td>
                        <td>{houseFundReport.depositBase}</td>
                      </tr>
                      <tr>
                        <td>当前缴纳单位</td>
                        <td>{houseFundReport.companyName}</td>
                        <td>月缴额</td>
                        <td>{houseFundReport.depositMonth}</td>
                      </tr>
                      <tr>
                        <td>公积金城市</td>
                        <td>{houseFundReport.locationCity}</td>
                        <td>公积金余额</td>
                        <td>{houseFundReport.balance}</td>
                      </tr>
                      <tr>
                        <td>状态</td>
                        <td>{houseFundReport.status}</td>
                        <td>最后入账时间</td>
                        <td>{houseFundReport.recordDate}</td>
                      </tr>
                      <tr>
                        <td>公积金身份证号校验</td>
                        <td>{houseFundReport.idCheck}</td>
                        <td>连续缴纳月数</td>
                        <td>{houseFundReport.continueMonths}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="社保"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th>姓名</th>
                        <td>{socialReport.nameCheck}</td>
                        <th>最近一次缴存基数</th>
                        <td>{socialReport.depositBase}</td>
                      </tr>
                      <tr>
                        <th>缴纳单位名称</th>
                        <td>{socialReport.companyName}</td>
                        <th>参保状态</th>
                        <td>{socialReport.status}</td>
                      </tr>
                      <tr>
                        <th>社保所在城市</th>
                        <td>{socialReport.locationCity}</td>
                        <th>最近连续缴纳月数</th>
                        <td>{socialReport.continueMonths}</td>
                      </tr>
                      <tr>
                        <th>社保身份证匹配</th>
                        <td>{socialReport.idCheck}</td>
                        <th>社保最近一次缴费时间距今的天数</th>
                        <td>{socialReport.lastPaytimeDay}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div> 
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="通讯录"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th colSpan="2">关键联系人（直系）</th>
                      </tr>
                      {
                        contactsData.directContact&&contactsData.directContact.map((value,index)=>(
                          <tr key={index}>
                            <td>{value.name}</td>
                            <td>{value.phoneNumber}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th colSpan="2">主叫/被叫次数最多的（五个）</th>
                      </tr>
                      {
                        (contactsData.oftenContact||contactsData.oftenedContact)&&(
                          <tr>
                            <td>
                              {
                                contactsData.oftenContact&&contactsData.oftenContact.map((value,index)=>(
                                  <p key={index}>{value.phoneNumber+' ('+value.name+')'}</p>
                                ))
                              }
                            </td>
                            <td>
                              {
                                contactsData.oftenedContact&&contactsData.oftenedContact.map((value,index)=>(
                                  <p key={index}>{value.phoneNumber+' ('+value.name+')'}</p>
                                ))
                              }
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th colSpan="2">主叫/被叫时长最多的（五个）</th>
                      </tr>
                      {
                        (contactsData.durationContact||contactsData.durationedContact)&&(
                          <tr>
                            <td>
                              {
                                contactsData.durationedContact.map((value,index)=>(
                                  <p key={index}>{value.phoneNumber+' ('+value.name+')'}</p>
                                ))
                              }
                            </td>
                            <td>
                              {
                                contactsData.durationedContact.map((value,index)=>(
                                  <p key={index}>{value.phoneNumber+' ('+value.name+')'}</p>
                                ))
                              }
                            </td>  
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="运营商"
                >
                  <table className="gird-table">
                    <tbody>
                      <tr>
                        <th>归属地</th>
                        <td>{basicInfo.mobileBelong }</td>
                        <th>话费余额</th>
                        <td>{operatorInfo.remain }</td>
                      </tr>
                      <tr>
                        <th>在网时长</th>
                        <td>{basicInfo.mobileInNetTime }</td>
                        <th>手机号码实名登记</th>
                        <td>{operatorInfo.isAuth }</td>
                      </tr>
                      <tr>
                        <td></td>
                        <th>1个月</th>
                        <th>3个月</th>
                        <th>6个月</th>
                      </tr>
                      <tr>
                        <th>通话时长</th>
                        <td>{operatorInfo.durationIn1Months }</td>
                        <td>{operatorInfo.durationIn3Months}</td>
                        <td>{operatorInfo.durationIn6Months}</td>
                      </tr>
                      <tr>
                        <th>通话次数</th>
                        <td>{operatorInfo.timesIn1Months}</td>
                        <td>{operatorInfo.timesIn3Months}</td>
                        <td>{operatorInfo.timesIn6Months}</td>
                      </tr>
                      <tr>
                        <th>主叫/被叫通话时长</th>
                        <td>{operatorInfo.dialingDurationIn1Months}/{operatorInfo.calledDurationIn1Months}</td>
                        <td>{operatorInfo.dialingDurationIn3Months}/{operatorInfo.calledDurationIn3Months}</td>
                        <td>{operatorInfo.dialingDurationIn6Months}/{operatorInfo.calledDurationIn6Months}</td>
                      </tr>
                      <tr>
                        <th>主叫/被叫通话次数</th>
                        <td>{operatorInfo.dialingTimesIn1Months}/{operatorInfo.calledTimesIn1Months}</td>
                        <td>{operatorInfo.dialingTimesIn3Months}/{operatorInfo.calledTimesIn3Months}</td>
                        <td>{operatorInfo.dialingTimesIn6Months}/{operatorInfo.calledTimesIn6Months}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="offsetcard" id="card5">   
                <Documents
                  fileChange={this.documentFileChange}
                  documents={documents}
                  applicationId={id}
                />
              </div>
              <div className="offsetcard" id="card6">
                <Card
                  type="inner"
                  title="短信"
                >
                  <div>含关键字的短信列表：</div>
                  {/* {
                    smsInfo.map((value,index)=>(
                      <div key={index}>
                        <div>共{value.length}条记录</div>
                        <div>
                          {
                            value.map((value1,index1)=>(
                              <p key={index1}>{value1}</p>
                            ))
                          }  
                        </div>
                      </div>
                    ))
                  } */}
                </Card>
              </div>
              <div className="offsetcard" id="card7">
                <Card
                  type="inner"
                  title="风险提示"
                >
                  <table className="gird-table">
                    <tbody>
                      {
                        reasons.map((value,index)=>(
                          <tr key={index}>
                            <th>
                              {value}
                            </th>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </Card>
              </div>
              
            </div>

            <div className="details_wrapright"
              ref={this.wraprightDOM}
              style={
                wraprightStyle
              }
            >
              <div className="offsetcard">
                <PhoneRecord
                  applicationId={id}
                />
              </div>
              <div className="offsetcard">    
                <VerifyOperation applyData={applyData}/>
              </div>  
              <div className="offsetcard">
                <Card
                  type="inner"
                  title="审批记录"
                >
                  <List
                    // bordered={true}
                    itemLayout="vertical"
                    className="history_wrap"
                    dataSource={applyData.approvalHistories}
                    renderItem={value=>(
                      <ListItem>
                        <p className="history_badge">
                          <Badge count={value.action} style={{ backgroundColor: '#5E87B0' }} />
                          <Badge count={value.operation} style={{ backgroundColor: '#5cb85c' }} />
                          <span >{parseOperatorName(value.operator)}</span>
                          <span>{utiDate.toDateTime(value.createdAt)}</span>
                        </p>
                        <div className="history_content">
                          {value.amount>0&&<div>
                            <strong>审批金额:</strong>
                            <span>{'￥' + value.amount}</span>
                          </div>}
                          {value.operation === '通过'&&<div>
                            <strong>审批期限:</strong>
                            <span>{value.tenor}</span>
                          </div>}
                          {value.reasonCode&&value.reasonCode.indexOf('D') !== 0&&<div>
                            <strong>原因代码:</strong>
                            <span>{value.reasonCode}</span>
                          </div>}
                        </div>
                        {value.comment&&<p>{value.comment}</p>}
                      </ListItem>
                    )}
                  />
                  
                </Card>
              </div>
              
            </div>
          </div>          
        </Card>
      </div>
       
    )
  }
}

export default Form.create()(ComponentInstance)