import {axios} from './axios';

import localForage from './localForage';
import {dataFormat,utiDate,validator as validatorOrigin} from 'utility-mar';
import md5 from 'md5';
import commonRequest from './commonRequest';

import {logOutOperate} from './logout';
import history from './history'
import cookie from './cookie';
import * as permission from './permission';

function parseOperatorName(input) {
  if (input === undefined || input === null) return;
  if(/.*_pool$/.test(input)) return 'un-assigned';
  if(input==='owner') return '客户本人';
  return input.replace(/@.*$/,'')
}

let validator=new validatorOrigin({
  patterns:{
    // 'password':{
    //   'pattern':/^[\d|\w]{6,8}$/,
    //   'errorMessage': '请输入正确的密码'
    // }
  },
  errorHandler:()=>{
    console.log(222222);
  }
});
export {
  axios,
  localForage,
  md5,
  dataFormat,
  utiDate,
  parseOperatorName,
  logOutOperate,
  history,
  cookie,
  validator,
  permission,
  commonRequest
}
