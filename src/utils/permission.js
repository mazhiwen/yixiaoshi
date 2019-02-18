import {axios} from './axios';
function getNestedChildren(arr, parent, parentKey='parent') {
  let out = []
  for(let item of arr) {
    if(item[parentKey] === parent) {
      let children = getNestedChildren(arr, item.id)
      if(children.length) item.children = children
      out.push(item)
    }
  }
  return out
}
function arrayToObject(array=[],keyName,valueName) {
  var obj = {}
  for (let item of array) {
    if (item[keyName] !== undefined) {
      obj[item[keyName]] = item[valueName]
    }
  }
  return obj
}

export function getPermission (systemCode,type) {
  return new Promise(function(resolve, reject){
    axios
    .get(`Domain-authority/v1/system-code/${systemCode}/owner-resources`,{params:{type}})
    .then((res) => {
      if(res){
        let views = [], menus = [], routes = [];
      
        const { result } = res;
        if(result){
          
        
          for (let item of result) {
            if (item.type === 'route') routes.push(item);
            if (item.type === 'view') views.push(item);
            if (item.type === 'menu') menus.push({label:item.name,url:item.url,parent:item.parentId,id:item.id,icon:item.icon});
          }
          // format
          // menus = menus.map(item=>({label:item.name,name:item.url,parent:item.parentId,id:item.id}))
          // make nested array
          const nestedMenus = getNestedChildren(menus,'0');
          // find sub menus for menu component
          const mainNestedMenus = findMenu(nestedMenus, 'main');
          // make a object for views permission checking
          const viewsMap = arrayToObject(views,'url','id');
          // make a object for routes permission checking
          const routesMap = arrayToObject(routes,'url','id');
          //menumap  url>id
          const menuMap={};
          menus.forEach((value,index)=>{
            menuMap[value.url]={
              id: value.id,
              parent:value.parent
            }
          })
          // return menbers
          resolve ({ 
            views, menus, routes, nestedMenus, 
            mainNestedMenus, viewsMap, routesMap,
            menuMap
          })
        }
      }else{
        reject();
      }
      
    })
  })
  
}

export function hasPermission (permissions, permission) {
  if (permissions.hasOwnProperty(permission)) return true
  return false;
}

export function findMenu (arr, name) {
  // no find to return []
  return ((arr.find(item=>item.name===name)||{}).children) || [];
}
