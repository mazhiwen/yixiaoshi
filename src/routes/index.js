
import Home from 'views/home'; 
import ApplyList from 'views/applylist'; 
import Login from 'views/login'; 
import ApplyDetail from 'views/applydetail'; 
import query from 'views/system/query'; 
import myorders from 'views/system/myorders'; 
import OrderDetails from 'views/system/orderdetails';
import BlacklistList from 'views/blacklist/list';
import BlacklistAdd from 'views/blacklist/add';
export default {
  login:{
    auth:false,
    base:'/login',
    path:'/login',
    component:Login,
  },
  home:{
    auth:true,
    base:'/home',
    path:'/home',
    component:Home,
  },
  applylist:{
    auth:true,
    base:'/applylist',
    path:'/applylist/:organization',
    component:ApplyList,
  },
  applydetail:{
    auth:true,
    base:'/applydetail',
    path:'/applydetail/:id',
    component:ApplyDetail,
  },
  system:{
    auth:true,
    base:'/system',
    path:'/system',
    // component:community,
    children:{
      query:{
        path:'/system/query',
        component:query
      },
      myorders:{
        path:'/system/myorders',
        component:myorders
      },
      orderdetails:{
        path:'/system/orderdetails/:id',
        component:OrderDetails
      }
    }
  },
  blacklist:{
    auth:true,
    base:'/blacklist',
    path:'/blacklist',
    // component:community,
    children:{
      list:{
        auth:true,
        path:'/blacklist/list',
        component:BlacklistList
      },
      add:{
        auth:true,
        path:'/blacklist/add',
        component:BlacklistAdd
      }
    }
  },

}