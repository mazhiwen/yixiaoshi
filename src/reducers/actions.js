const loginReducer=(state={ count: 0 },action)=>{
  switch(action.type){
    case 'increase':
      return {
          ...state,
          themeColor:action.themeColor
      }    
    default:
      return state    
  }


}

export default loginReducer