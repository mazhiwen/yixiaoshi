import * as React from 'react';
import {
  Form
} from 'antd';

// 全局统一样式的formitem组件
//垂直排列，一行水平label input
// 配合外层Form 加 className="inlineblock_formwrap"
const FormItemI=(props)=>{
  const {children,...rest}=props;
  return(
  
    <Form.Item 
      labelCol={{
        // xs:{span:16},
        sm: { span: 8 },
      }}
      wrapperCol={{
        // xs:{span:8},
        sm: { span: 16 },
      }}           
      {...rest}
    >            
      {
        children
      }
    </Form.Item>
  )
};

export default FormItemI;