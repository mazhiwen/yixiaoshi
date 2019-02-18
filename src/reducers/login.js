const reducer=(
    state={
      LOGINSTATUS:false
    },
    action
  )=>{
    const {LOGINSTATUS} = action;
    switch(action.type){
      case 'SET_LOGINSTATUS':
        return {
          LOGINSTATUS
        }    
      default:
        return state    
    }


  }

//reducer 根据action type 返回state
export default reducer