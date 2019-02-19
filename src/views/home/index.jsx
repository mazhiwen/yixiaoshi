import * as React from 'react';
import {
  Form, InputNumber, Button, DatePicker,Select,Row,
  Col,Table,Card,Tabs,Input
} from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import { Link } from 'react-router-dom'

import {axios,utiDate} from 'utils';
import routes from 'routes';
import {stateList} from 'configs';

import moment from 'moment';

const TabPane = Tabs.TabPane;
const FormItem= Form.Item;




class HomeFormOrigin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
  }

  
  render(){

    const {
      getFieldDecorator, getFieldsError
    } = this.props.form;
    
    
    return(
      <div className="page_home">
        <Tabs  defaultActiveKey="1">
          <TabPane tab="价格计算" key="1">
            <Form layout='vertical' onSubmit={this.handleSubmit}>
              <Card size="small" title="每单总成本">  
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem label="预计月销量">
                      {getFieldDecorator('predictMonthSaleCount',{
                      })(
                        <InputNumber />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="每月租金,水电等场地费用">
                      {getFieldDecorator('monthRent',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem label="预计食材成本">
                      {getFieldDecorator('predictFoodCost',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="包装成本">
                      {getFieldDecorator('packageCost',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="每单总成本">
                      {getFieldDecorator('totalCost',{
                      })(
                        <InputNumber step={0.1} disabled/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Card>  
              <Card size="small" title="售价" style={{marginTop:10}}>
                <Row gutter={8}>
                  {/* <Col span={12}>
                    <FormItem label="预计售价">
                      {getFieldDecorator('predictPrice',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col> */}
                  <Col span={12}>
                    <FormItem label="配送费">
                      {getFieldDecorator('riderCost',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="标餐盒费">
                      {getFieldDecorator('salePackageCost',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="满减（等活动支出）">
                      {getFieldDecorator('activityCost',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="平台标价">
                      {getFieldDecorator('salePrice',{
                      })(
                        <InputNumber step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="平台收取费用">
                      {getFieldDecorator('appCost',{
                      })(
                        <InputNumber disabled step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="客户付款">
                      {getFieldDecorator('userPay',{
                      })(
                        <InputNumber disabled step={0.1}/>
                      )}
                    </FormItem>
                  </Col>  
                </Row>
              </Card>
              <Card size="small" title="利润" style={{marginTop:10}}>
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem label="实际到账">
                      {getFieldDecorator('getMoney',{
                      })(
                        <InputNumber disabled step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="计算所得利润">
                      {getFieldDecorator('profit',{
                      })(
                        <InputNumber disabled step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="利润成本比（利润成本比=利润/每单总成本）">
                      {getFieldDecorator('profitCardinal',{
                      })(
                        <InputNumber disabled step={0.1}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>  
              </Card>
            </Form>
          </TabPane>
          {/* <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane> */}
        </Tabs>
        
      </div>
    )
  }
}





// export default Form.create({
//   onValuesChange
// })(Home)

const HomeForm = Form.create({
  onFieldsChange(props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    console.log(props);
    const {
      totalCost,
      getMoney,
      userPay,
      predictFoodCost,
      predictMonthSaleCount,
      monthRent,
      packageCost,
      profitCardinal,
      activityCost,
      riderCost,
      appCost,
      salePackageCost,
      profit,
      salePrice
    } =props;
    return {
      totalCost: Form.createFormField({
        value: totalCost,
      }),
      getMoney: Form.createFormField({
        value: getMoney,
      }),
      userPay: Form.createFormField({
        
        value: userPay,
      }),
      predictFoodCost:Form.createFormField({
        value:predictFoodCost
      }),
      predictMonthSaleCount:Form.createFormField({
        value:predictMonthSaleCount
      }),
      monthRent:Form.createFormField({
        value:monthRent
      }),
      packageCost:Form.createFormField({
        value:packageCost
      }),
      profitCardinal:Form.createFormField({
        value:profitCardinal
      }),
      activityCost:Form.createFormField({
        value:activityCost
      }),
      riderCost:Form.createFormField({
        value:riderCost
      }),
      appCost:Form.createFormField({
        value:appCost
      }),
      salePackageCost:Form.createFormField({
        value:salePackageCost
      }),
      profit:Form.createFormField({
        value:profit
      }),
      salePrice:Form.createFormField({
        value:salePrice
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    props.onValuesChange(changedValues);
  }
})(HomeFormOrigin);




let calculateData=(formValues)=>{
  let {
    monthRent,predictMonthSaleCount,predictFoodCost,packageCost,
    salePackageCost,salePrice,activityCost,riderCost
  } = formValues;
  salePrice=parseFloat(salePrice)||0; 
  salePackageCost=parseFloat(salePackageCost)||0;
  activityCost=parseFloat(activityCost)||0;
  riderCost=parseFloat(riderCost)||0;
  monthRent=parseFloat(monthRent)||0;
  predictMonthSaleCount=parseFloat(predictMonthSaleCount)||0;
  predictFoodCost=parseFloat(predictFoodCost)||0;
  packageCost=parseFloat(packageCost)||0;
  //每单总成本 = 每月租金,水电等场地费用 / 预计月销量 + 预计食材成本 + 包装成本
  let totalCost=monthRent/predictMonthSaleCount+predictFoodCost+packageCost;
  //平台收费： （平台标价 + 餐盒费 - 满减（等活动支出））* 0.21 
  // 当平台收费《=4.5， 
  // （平台标价 + 餐盒费 - 满减（等活动支出））* 0.21 <= 4.5
  //当 平台标价 <= 4.5/0.21 - 餐盒费 + 满减（等活动支出）,平台收费=4.5
  let appCost;
  if(salePrice<=(4.5/0.21-salePackageCost+activityCost)){
    appCost=4.5;
  }else{
    appCost=0.21*( salePrice + salePackageCost - activityCost);
  }
  //到账 :  平台标价 + 餐盒费 - 平台收费 - 满减（等活动支出）
  let getMoney=salePrice+ salePackageCost -activityCost-appCost;
  //利润 : 到账 - 每单总成本 
  // =》利润 = 平台标价 + 餐盒费 - 平台收费 - 满减（等活动支出）- 每单总成本 
  let profit =  getMoney - totalCost;
  // =》利润成本比 = 利润 / 每单总成本
  let profitCardinal=profit / totalCost *100
  //客户付款： 平台标价 + 餐盒费 + 配送费 - 满减（等活动支出）
  let userPay =  salePrice + salePackageCost + riderCost - activityCost;
  return {
    totalCost,
    getMoney,
    userPay,
    predictFoodCost,
    predictMonthSaleCount,
    monthRent,
    packageCost,
    profitCardinal,
    activityCost,
    riderCost,
    appCost,
    salePackageCost,
    profit,
    salePrice
  };
}
class Home extends React.Component{
  constructor(props){
    super(props);
    this.state={
      
      formValues:{
        predictMonthSaleCount:550,
        monthRent:4500,
        predictFoodCost:6,
        packageCost:1,
        totalCost:0,
        profitCardinal:1,
        profit:0,
        predictPrice:0,
        salePrice:20,
        salePackageCost:1,
        activityCost:3,
        riderCost:4
      },
      data : [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115},
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150}
      ],
      cols : {
        sold: { alias: '销售量' },
        genre: { alias: '游戏种类' }
      }
    }
  }
  onValuesChange=(changedValues)=>{

    this.setState(({ formValues }) => ({
      formValues: { 
        ...formValues, ...changedValues 
      },
    }));
  }
  handleFormChange = (changedFormValues) => {
    this.setState(({ formValues }) => ({
      formValues: { ...formValues, ...changedFormValues },
    }));
  }
  generatePriceProfit=()=>{
    
    const {
      totalCost,
      activityCost,
      salePackageCost,
    } = this.calculateFormValues;
    let data=[];
    let salePrice = 1;
    while(salePrice<70){
      let appCost;
      if(salePrice<=(4.5/0.21-salePackageCost+activityCost)){
        appCost=4.5;
      }else{
        appCost=0.21*( salePrice + salePackageCost - activityCost);
      }
      let getMoney=salePrice+ salePackageCost -activityCost-appCost;
      let profit =  getMoney - totalCost;
      data.push({
        salePrice,
        profit
      });
      salePrice++;
    }
    this.setState({
      data,
      cols : {
        profit: { alias: '利润' },
        salePrice: { alias: '标价' }
      }
    })
  }
  render() {
    const {formValues,data,cols} = this.state;
    this.calculateFormValues=calculateData(formValues);
    
    return (
      <div>
        <HomeForm 
          {...this.calculateFormValues} 
          onValuesChange={this.onValuesChange}
        />
        {/* <pre className="language-bash">
          {JSON.stringify(formValues, null, 2)}
        </pre> */}
        <Button onClick={this.generatePriceProfit}>生成价格-利润梯度表</Button>
        <Chart width={500} height={500} data={data} scale={cols}>
          <Axis name="salePrice" />
          <Axis name="profit" />
          <Legend position="top" dy={-20} />
          <Tooltip />
          <Geom type="line" position="salePrice*profit"  />
        </Chart>
      </div>
    );
  }
}



export default Home