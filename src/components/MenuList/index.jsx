import * as React from 'react';
import {Menu,Icon} from 'antd';
import { Link ,withRouter,NavLink} from 'react-router-dom'
import routes from 'routes';
import {axios,localForage,permission,history} from 'utils';

const { SubMenu } = Menu;

 
class ComponentInstance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedKeys:['0','1'],
      menuMap:{},
      openKeys:[],
      nestedMenus : [
        {
          label:'全部',
          url:routes.home.path,
          id:'home'
          
        },
        {
          label:'富士康',
          children:[
            {
              id:'games',
              url:`${routes.applylist.base}/all`,
              label:'富士康'
            }
          ],
          id:'homee'
        }
      ]

    };
    
  }
  onOpenChange=(openKeys)=>{
    this.setState({openKeys});
  }
  
  componentDidMount(){
    permission.getPermission('anti-fraud','view,menu,route')
      .then((value)=>{
        console.log(value);
        const {nestedMenus,menuMap} =value;
        this.setState({
          nestedMenus,
          menuMap
        })
        // url -> 子菜单 父菜单
        //根据location /aaa/b aaa值作为激活导航栏item
        function urlToMenu(url){
          let match = url.match(/(\/[^\/]*){1}/g);
          if(match.length>=2){
            return `${match[0]}${match[1]}`;
          }else{
            return `${match[0]}`;
          }
          
        }
        function getSelectMenu(url){
          return menuMap[urlToMenu(url)];
        }
        if(getSelectMenu(this.props.location.pathname)){
          let selectMenuData=getSelectMenu(this.props.location.pathname);
          this.setState({
            selectedKeys:[selectMenuData['id']],
            openKeys:[selectMenuData['parent']]
          });
        }
        
        //下段 会引起react 报错 state 在 componentWillUnmount中重置state
        this.props.history.listen((location, action)=>{
          if(getSelectMenu(location.pathname)){
            let selectMenuData=getSelectMenu(location.pathname);
            this.setState({
              selectedKeys:[selectMenuData['id']]
            });
          }
          
        });
      })
      .catch(()=>{

      });
   

  }
  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
    };
  }
  render(){
    const {nestedMenus,selectedKeys,openKeys} = this.state;
    return(
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={this.onOpenChange}
        style={{ height: '100%' }}
        
      >
        {
          nestedMenus.map((v,index)=>
            v.children?(
              <SubMenu 
                key={v.id} 
                title={
                  <span>
                    <Icon type="bars" />
                    {/* {v.url?(<Link to={v.url}>{v.label}</Link>):(v.label)} */}
                    {v.label}
                  </span>
                }
              >
                {
                  v.children.map((vSub,indexSub)=>
                    <Menu.Item key={vSub.id}>
                      <NavLink 
                        to={{
                          pathname:vSub.url
                        }}
                        
                      >
                        {vSub.label}
                      </NavLink>
                      
                    </Menu.Item>
                  )
                }
              </SubMenu>
            ):(
              <Menu.Item key={v.id}>
                <Icon type="bars" />
                <span><Link to={v.url}>{v.label}</Link></span>
              </Menu.Item>
            )
          )
        }
      </Menu>
    )
  }
}

export default withRouter(ComponentInstance)