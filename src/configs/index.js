import pushBackReason from './pushBackReason'; 
import stateList from './stateList'; 
import project from './project'; 
import * as blackTypeTreeData  from './blackTypeTreeData'; 
import packageJsonObj from '../../package.json';

const configs = {
  ...project,
  contextPath:packageJsonObj.Domain.contextPath,
  name:'name',
  ...blackTypeTreeData,
  authToken: 'x-user-token',
  authMobile: 'x-user-mobile',
  xMerchantId: 'x-merchant-id',
  checkItemInfo: 'checkItemInfo',
  userPassword: 'userPassword',
  industryInvolved: 'industryInvolved',
  wedefendOriginNameList: 'wedefendOriginNameList',
  XPARTNERCODE: 'X-PARTNER-CODE',
  partnerCode: 'partnerCode',
  expires: 1, // day
  domain: '.DOMAIN.com',
  userEmail:'userEmail',
  // 分支和环境名称一致
  API: {
    'master': {
      iamPrefix: 'https://saas-dev.DOMAIN.com/',
      prefix: 'https://japi-dev.DOMAIN.com/Domain-anti-fraud/api/'
    },
    'integration': {
      iamPrefix: 'https://saas-fat.DOMAIN.com/',
      prefix: 'https://japi-fat.DOMAIN.com/Domain-anti-fraud/',
    },
    'pre-production': {
      iamPrefix: 'https://saas-uat.DOMAIN.com/',
      prefix: 'https://japi-uat.DOMAIN.com/judex/api/'
    },
    'production': {
      iamPrefix: 'https://saas.DOMAIN.com/',
      prefix: 'https://channels.DOMAIN.com/judex/api/',
    }
  },
  // basename: {
  //   'master': {
  //     prefix: 'https://m-dev.DOMAIN.com/judex/api/'
  //   },
  //   'integration': {
  //     prefix: 'https://m-fat.DOMAIN.com/judex/api/'
  //   },
  //   'pre-production': {
  //     prefix: 'https://japi-uat.DOMAIN.com/judex/api/'
  //   },
  //   'production': {
  //     prefix: 'https://channels.DOMAIN.com/judex/api/',
  //   }
  // },
  stateList,
  ProcessStatus:{
    undo:'未调查',
    doing:'进行中',
    done:'处理完成'
  },
  ResultStatus:{
    undo:'未调查',
    'no-risk':'清白',
    'high-risk':'高风险',
    'doubtful':'可疑',
    'cheat':'欺诈'
  },
  relationshipList: {
    parents:{
      "id": 1,
      "name": "parents",
      "description": "父母"
    }, 
    spouse:{
      "id": 2,
      "name": "spouse",
      "description": "配偶"
    }, 
    sibling:{
      "id": 3,
      "name": "sibling",
      "description": "兄弟姐妹"
    }, 
    teacher:{
      "id": 4,
      "name": "teacher",
      "description": "老师"
    }, 
    classmate:{
      "id": 5,
      "name": "classmate",
      "description": "同学"
    }, 
    friend:{
      "id": 6,
      "name": "friend",
      "description": "朋友"
    }, 
    colleague:{
      "id": 7,
      "name": "colleague",
      "description": "同事"
    }, 
    children:{
      "id": 8,
      "name": "children",
      "description": "子女"
    }
  },
  roleList: {
    "": "全部",
    "APPROVAL_PRE": "预审",
    "APPROVAL_INIT": "初审",
    "APPROVAL_FRAUD": "反欺诈",
    "APPROVAL_FINAL": "终审"
  },
  "wedefendDecisionList": [
    {
      "code": "accept",
      "name": "通过"
    }, {
      "code": "reject",
      "name": "拒绝"
    }, {
      "code": "return",
      "name": "退回"
    }, {
      "code": "review",
      "name": "转人工"
    }, {
      "code": "freeze",
      "name": "冻结"
    }, {
      "code": "rejected",
      "name": "拒绝"
    }, {
      "code": "cancelled",
      "name": "取消"
    }, {
      "code": "push_backed",
      "name": "退回"
    }
  ],
  "marriageList": [
    {
      "id": 1,
      "type": 0,
      "name": "未婚",
      "createdAt": 1488879518000,
      "updatedAt": 1488879518000
    }, {
      "id": 2,
      "type": 1,
      "name": "已婚已育",
      "createdAt": 1488879518000,
      "updatedAt": 1490095800000
    }, {
      "id": 3,
      "type": 2,
      "name": "已婚未育",
      "createdAt": 1488879518000,
      "updatedAt": 1490095803000
    }, {
      "id": 4,
      "type": 3,
      "name": "离异",
      "createdAt": 1488879520000,
      "updatedAt": 1488879520000
    }
  ],
  blacklistTypeValueMap: {
    'loanId':{
      key:'loanId',
      text:'贷款号',
    },
    'CNID':{
      key:'cnid',
      text:'身份证号',
      addUrl:'cnid'
    },
    'PHONE_NUMBER':{
      key:'phoneNumber',
      text:'手机号',
      addUrl:'personal/mobile'
    },
    'COMPANY_NAME':{
      key:'companyName',
      text:'公司名称',
      addUrl:'companyName'
    },
    'COMPANY_TELEPHONE':{
      key:'companyTelephone',
      text:'公司电话',
      addUrl:'companyTel'
    },
    'LISONS_PHONE':{
      key:'companyTelephone',
      text:'联系人',
      addUrl:'liason/mobile'
    }
  },
  "degreeList": [
    {
      "id": 1,
      "name": "小学"
    }, {
      "id": 2,
      "name": "初中"
    }, {
      "id": 3,
      "name": "高中"
    }, {
      "id": 4,
      "name": "中专"
    }, {
      "id": 5,
      "name": "大专"
    }, {
      "id": 6,
      "name": "本科"
    }, {
      "id": 7,
      "name": "硕士"
    }, {
      "id": 8,
      "name": "博士"
    }, {
      "id": 9,
      "name": "博士后"
    }, {
      "id": 10,
      "name": "高中及以下"
    }, {
      "id": 11,
      "name": "硕士及以上"
    }
  ],
  pushBackReason
  
}
module.exports.default = module.exports = configs


