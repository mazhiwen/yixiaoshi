import * as React from 'react';
import {
  Form, Button,
  Card,Modal,
  Upload,notification
} from 'antd';
import {axios} from 'utils';



class ComponentOrigin extends React.Component{
  constructor(props){
    super(props);
    
    this.state=({
      previewVisible: false,
      previewImage: '',
      
    })

  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleCancel = () => this.setState({ previewVisible: false })
  beforeUpload=(file) =>{
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      // message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      // message.error('Image must smaller than 2MB!');
    }
    let formData = new FormData();
    formData.append('upload',file);
    axios.post(
        'applications/' + this.props.applicationId + '/documents/admin_uploaded',
        formData,
        {
          headers:{'Content-Type':'multipart/form-data'}
        }
      )
      .then((res)=>{
        // this.appUplList.splice(0,0,{url:data.data,createAt:data.timestamp});
        this.refresh();     
        notification['success']({
          message:'图片上传成功'
        });
      });
    return false;
  }
  refresh =  () => {
    axios.put('applications/sync/documents/' + this.props.applicationId)
      .then(function (res) {
        this.props.fileChange(res.data.documents);
      })
  }


  componentDidMount(){
    
    
    
  }
  render(){
    const {
      documents
    } = this.props;
    const {
      previewVisible,previewImage
    }=this.state;
    let fileList=[];
    documents&&documents.map((value,index)=>{
      fileList.push({
        uid: value.id,
        name: 'xxx.png',
        status: 'done',
        url: value.url
      })
    })
    
    return (
      <Card
        type="inner"
        title="证明文件"
        extra={
          <Upload
            beforeUpload={this.beforeUpload}
          >
            <Button type="primary"  size="small">上传</Button>
          </Upload>
        }
      >
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          // onChange={this.handleChange}
        >
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    )
  }
}
const ComponentInstance =Form.create()(ComponentOrigin);



export default ComponentInstance;
