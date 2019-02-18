const blackTypeTreeData= [
  {
    title: '身份欺诈',
    value: 'F001',
    key: 'F001',
    selectable:false,
    children: [
      {
        title: '白马欺诈',
        value: 'F001-01',
        key: 'F001-01',
        selectable:false,
        children: [
          {
            title: '白马欺诈',
            value: 'F001-01-1',
            key: 'F001-01-1',
          }
        ]
      }, 
      {
        title: '伪冒申请',
        value: 'F001-02',
        key: 'F001-02',
        selectable:false,
        children: [
          {
            title: '伪冒他人身份',
            value: 'F001-02-1',
            key: 'F001-02-1',
          }, 
          {
            title: '伪冒他人号码',
            value: 'F001-02-2',
            key: 'F001-02-2',
          }
        ]
      },
      {
        title: '账户盗用',
        value: 'F001-03',
        key: 'F001-03',
      }
    ],
  }, 
  {
    title: '组团骗贷',
    value: 'F002',
    key: 'F002',
    selectable:false,
    children: [
      {
        title: '组团骗贷',
        value: 'F002-01',
        key: 'F002-01',
        selectable:false,
        children: [
          {
            title: '组团骗贷',
            value: 'F002-01-1',
            key: 'F002-01-1',
          }
        ]
      }
    ]
  },
  {
    title: '恶意攻击',
    value: 'F003',
    key: 'F003',
    selectable:false,
    children: [
      {
        title: '恶意攻击',
        value: 'F003-01',
        key: 'F003-01',
        selectable:false,
        children: [
          {
            title: '恶意攻击',
            value: 'F003-01-1',
            key: 'F003-01-1',
          }
        ]
      }
    ]
  },
  {
    title: '代办申请',
    value: 'F004',
    key: 'F004',
    selectable:false,
    children: [
      {
        title: '中介申请',
        value: 'F004-01',
        key: 'F004-01',
        selectable:false,
        children: [
          {
            title: '中介申请',
            value: 'F004-01-1',
            key: 'F004-01-1',
          }
        ]
      },
      {
        title: '中介代办',
        value: 'F004-02',
        key: 'F004-02',
        selectable:false,
        children: [
          {
            title: '黑中介',
            value: 'F004-02-1',
            key: 'F004-02-1',
          },
          {
            title: '白中介',
            value: 'F004-02-2',
            key: 'F004-02-2',
          }
        ]
      }
    ]
  },
  {
    title: '虚假信息',
    value: 'F005',
    key: 'F005',
    selectable:false,
    children: [
      {
        title: '联系人虚假',
        value: 'F005-01',
        key: 'F005-01',
        selectable:false,
        children: [
          {
            title: '直系联系人虚假',
            value: 'F005-01-1',
            key: 'F005-01-1',
          },
          {
            title: '其他联系人虚假',
            value: 'F005-01-2',
            key: 'F005-01-2',
          }
        ]
      },
      {
        title: '单位虚假',
        value: 'F005-02',
        key: 'F005-02',
        selectable:false,
        children: [
          {
            title: '工作单位虚假',
            value: 'F005-02-1',
            key: 'F005-02-1',
          },
          {
            title: '工作单位固话虚假',
            value: 'F005-02-2',
            key: 'F005-02-2',
          },
          {
            title: '工作单位地址虚假',
            value: 'F005-02-3',
            key: 'F005-02-3',
          }
        ]
      },
      {
        title: '虚假资料',
        value: 'F005-03',
        key: 'F005-03',
        selectable:false,
        children: [
          {
            title: '身份证伪造',
            value: 'F005-03-1',
            key: 'F005-03-1',
          },
          {
            title: '手持身份证伪造',
            value: 'F005-03-2',
            key: 'F005-03-2',
          }
        ]
      },
    ]
  },
  {
    title: '电信诈骗',
    value: 'F006',
    key: 'F006',
    selectable:false,
    children: [
      {
        title: '电信诈骗',
        value: 'F006-01',
        key: 'F006-01',
        selectable:false,
        children: [
          {
            title: '电信诈骗',
            value: 'F006-01-1',
            key: 'F006-01-1',
          }
        ]
      }
    ]
  },
  {
    title: '套现行为',
    value: 'F007',
    key: 'F007',
    selectable:false,
    children: [
      {
        title: '套现行为',
        value: 'F007-01',
        key: 'F007-01',
        selectable:false,
        children: [
          {
            title: '套现行为',
            value: 'F007-01-1',
            key: 'F007-01-1',
          }
        ]
      }
    ]
  },
  {
    title: '账户代管',
    value: 'F008',
    key: 'F008',
    selectable:false,
    children: [
      {
        title: '账户代管',
        value: 'F008-01',
        key: 'F008-01'
      }
    ]
  },
  {
    title: '薅羊毛',
    value: 'F009',
    key: 'F009',
    selectable:false,
    children: [
      {
        title: '薅羊毛',
        value: 'F009-01',
        key: 'F009-01',
        selectable:false,
        children: [
          {
            title: '薅羊毛',
            value: 'F009-01-1',
            key: 'F009-01-1',
          }
        ]
      }
    ]
  }
]

let blackTypeTreeDataMap={};
const getMapIterator=(params)=>{
  params.map((value,index)=>{
    blackTypeTreeDataMap[value.key]=value.title;
    if(value.children){
      getMapIterator(value.children)
    }
  })
}
getMapIterator(blackTypeTreeData);

const crimeCategoryToText=(paramas)=>{
  let res='';
  let arr=[];
  if(paramas){
    if(Object.prototype.toString.call(paramas)==="[object String]"){
      if(paramas.includes('[')){
        arr = paramas.split('|');
        arr.forEach((value,index)=>{
          arr[index]=value.slice(1,-1)
        })
      }else{
        arr=paramas.split(',');
      }
    }else{
      arr=paramas;
    }
    arr&&arr.map((value,index)=>{
      res+=blackTypeTreeDataMap[value]+' ';
    })
  }  
  return res;
}

const crimeCategoryToParams=(arr)=>{
  return arr.join();
}
export {
  blackTypeTreeData,blackTypeTreeDataMap,
  crimeCategoryToText,crimeCategoryToParams
}



