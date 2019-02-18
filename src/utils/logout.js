import localForage from './localForage';

import { authMobile, authToken ,XPARTNERCODE,partnerCode} from 'configs';
import history from './history'


let logOutOperate=()=>{
  localForage.removeItem(authToken);
  localForage.removeItem(authMobile);
  localForage.getItem(XPARTNERCODE,(err,value)=>{
    history.push(`/login?${partnerCode}=${value}`);
  })
}


export {
  logOutOperate
}