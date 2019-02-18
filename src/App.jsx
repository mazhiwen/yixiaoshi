import React, { Component } from 'react';
// import logo from './logo.svg';
import {
  Layout,LocaleProvider
} from 'antd';
import './styles/index.less';
import {Route,Switch } from 'react-router-dom'
import Login from './views/login';
import MenuList from './components/MenuList/';
import MainHeader from './components/MainHeader';
import routes from 'routes';
import {localForage} from 'utils';
import PrivateRoute from './components/PrivateRoute';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const {Sider,Content}=Layout;






class App extends Component {
  constructor(props){
    super(props);
    this.state={
      account:''
    };

    
    
  }
  openInNewTab=(url)=> {
    let win = window.open(url, '_blank');
    win.focus();  
  }

  componentDidMount(){
    
    
  }
  
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        {this.props["location"]["pathname"]!=='/login'?
        <Layout>
          

          <Layout>
            
            <Layout className="content_layout" >
              <Content style={{  margin: 0, minHeight: 1000 }}>
                <Switch>
                  <PrivateRoute auth={false} 
                    path='/' exact
                    component={routes.home.component}
                  />        
                  <PrivateRoute auth={routes.home.auth} 
                    path={routes.home.path} 
                    component={routes.home.component}
                  />  
                  <PrivateRoute auth={routes.applylist.auth} 
                    path={routes.applylist.path} 
                    component={routes.applylist.component}
                  /> 
                  
                </Switch>  
              </Content>
            </Layout>
          </Layout> 
          
        </Layout>:
        <Login/>}
      </LocaleProvider>
      
    );
  }
  
}

export default App;
