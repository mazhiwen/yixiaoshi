import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Route,Router } from 'react-router-dom';
import reducers from './reducers';
import { createStore } from 'redux';
import { Provider} from 'react-redux';
// import history from './utils/history'
import { authToken} from 'configs';

import {localForage,history} from 'utils';


let store =null;

localForage.getItem(authToken)
.then(function(value) {
  let LOGINSTATUS=value!==null;
  store = createStore(reducers,{login:{
    LOGINSTATUS
  }});
})
.catch(function(err) {
})
.finally(()=>{
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}/>
      </Router>
    </Provider>
    ,
    document.getElementById('root')
  );
  
  registerServiceWorker();
});


