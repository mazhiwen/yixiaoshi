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
import DataSet from '@antv/data-set';

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
                  <Col span={12}>
                    <FormItem label="利润成本比（利润成本比=利润/每单总成本）">
                      {getFieldDecorator('profitCardinal',{
                      })(
                        <InputNumber step={0.1}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
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
                        <InputNumber disabled step={0.1}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="客户使用红包额">
                      {getFieldDecorator('userRed',{
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
      salePrice,
      userRed
    } =props;
    return {
      userRed: Form.createFormField({
        value: userRed,
      }),
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
    salePackageCost,salePrice,activityCost,riderCost,userRed,profitCardinal
  } = formValues;
  userRed=parseFloat(userRed)||0;
  salePrice=parseFloat(salePrice)||0; 
  salePackageCost=parseFloat(salePackageCost)||0;
  activityCost=parseFloat(activityCost)||0;
  riderCost=parseFloat(riderCost)||0;
  monthRent=parseFloat(monthRent)||0;
  predictMonthSaleCount=parseFloat(predictMonthSaleCount)||0;
  predictFoodCost=parseFloat(predictFoodCost)||0;
  packageCost=parseFloat(packageCost)||0;
  // =》利润成本比 = 利润 / 每单总成本  xxx% 
  profitCardinal=parseFloat(profitCardinal)||0;
  //每单总成本 = 每月租金,水电等场地费用 / 预计月销量 + 预计食材成本 + 包装成本
  let totalCost=monthRent/predictMonthSaleCount+predictFoodCost+packageCost;
  
  //利润 : 每单总成本 * 利润成本比
  let profit =  totalCost * profitCardinal/100;
  
  //利润 = 到账 - 每单总成本
  // 到账 = 利润 + 每单总成本
  // getMoney = profit + totalCost;
  
  let getMoney=profit + totalCost;
  
  //平台收费： （平台标价 + 餐盒费 - 满减（等活动支出））* 0.21 
  // 当平台收费《=4.5， 
  // （平台标价 + 餐盒费 - 满减（等活动支出））* 0.21 <= 4.5
  //当 平台标价 <= 4.5/0.21 - 餐盒费 + 满减（等活动支出）,平台收费=4.5
  let appCost;
  //假设平台收费为4.5，计算售价
  salePrice=4.5/0.21+activityCost-salePackageCost;
   
  // =》利润 = 平台标价 + 餐盒费 - 满减（等活动支出）- 平台收费 - 每单总成本 
  // profit=salePrice+salePackageCost-activityCost-平台收费 - totalCost
  // profit=salePrice+salePackageCost-activityCost-平台收费 - totalCost
  //到账 =  平台标价 + 餐盒费 - 平台收费 - 满减（等活动支出）
  if(salePrice+salePackageCost-activityCost-4.5<getMoney){
    //当当前售价 所得利润小于1倍成本 按照大于4.5推算售价
    // getMoney=salePrice+salePackageCost-activityCost-(0.21*( salePrice + salePackageCost - activityCost))
    // getMoney - salePackageCost+ activityCost + 0.21salePackageCost -0.21activityCost= 0.79*salePrice  
    // getMoney - 0.79*salePackageCost+ 0.79*activityCost = 0.79*salePrice  
    salePrice= (getMoney - 0.79*salePackageCost+ 0.79*activityCost)/0.79;
    appCost=0.21*( salePrice + salePackageCost - activityCost);
  }else{
    //当当前售价 所得利润大于1倍成本 按照小于4.5推算售价
    // getMoney=salePrice+salePackageCost-activityCost-4.5
    salePrice=getMoney-salePackageCost+activityCost+4.5;
    appCost=4.5;
  }

  
  //客户付款： 平台标价 + 餐盒费 + 配送费 - 满减（等活动支出）
  let userPay =  salePrice + salePackageCost + riderCost - activityCost -userRed;
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
    salePrice,
    userRed
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
        profitCardinal:100,
        profit:0,
        predictPrice:0,
        salePrice:20,
        salePackageCost:1,
        activityCost:3,
        riderCost:4,
        userRed:0
      },
      chartDataPrice : [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115},
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150}
      ],
      scalePrice : {
        sold: { alias: '销售量' },
        genre: { alias: '游戏种类' }
      },
      chartDataMonthcount : [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115},
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150}
      ],
      scaleMonthcount : {
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
      riderCost,
      userRed
    } = this.calculateFormValues;
    let chartData=[];
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
      let userPay =  salePrice + salePackageCost + riderCost - activityCost -userRed;
      chartData.push({
        salePrice,
        profit,
        userPay
      });
      salePrice++;
    }
    const transChartData = new DataSet().createView()
      .source(chartData)
      .transform({
        type: 'fold',
        fields: [ 'profit', 'userPay' ], // 展开字段集
        key: 'key',                   // key字段
        value: 'amount',               // value字段
        retains: [ 'salePrice' ]        // 保留字段集，默认为除 fields 以外的所有字段
      });
      console.log(transChartData);
    this.setState({
      chartDataPrice:transChartData,
      scalePrice : {
        profit: { alias: '利润' },
        salePrice: { alias: '标价' },
        userPay:{ alias: '用户付款' },
        amount:{alias:'金额'}
      }
    })
  }
  generateMonthcountChart=()=>{
    const {
      monthRent,
      predictFoodCost,
      packageCost,
      salePrice,
      salePackageCost,
      activityCost,

    } = this.calculateFormValues;
    let chartData=[];
    let predictMonthSaleCount = 1;
    //固定当前定价 对应的月销量
    while(predictMonthSaleCount<10000){
      let appCost;
      if(salePrice<=(4.5/0.21-salePackageCost+activityCost)){
        appCost=4.5;
      }else{
        appCost=0.21*( salePrice + salePackageCost - activityCost);
      }
      let totalCost=monthRent/predictMonthSaleCount+predictFoodCost+packageCost;
      let getMoney=salePrice+ salePackageCost -activityCost-appCost;
      let profit =  (getMoney - totalCost)*predictMonthSaleCount;
      
      chartData.push({
        predictMonthSaleCount,
        profit,
      });
      predictMonthSaleCount=predictMonthSaleCount+30;
    }
    this.setState({
      chartDataMonthcount:chartData,
      scaleMonthcount : {
        profit: { alias: '利润' },
        predictMonthSaleCount: { alias: '月销量' }
      }
    })
  }
  componentDidMount(){
    this.generatePriceProfit();
  }
  render() {
    const {
      formValues,chartDataPrice,scalePrice,
      chartDataMonthcount,scaleMonthcount
    } = this.state;
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
        <Button onClick={this.generatePriceProfit}>生成当前策略下(标价-每单利润),(标价-用户付款)关系图</Button>
        <Chart width={500} height={500} 
          data={chartDataPrice} scale={scalePrice}
        >
          <Axis name="salePrice" title/>
          <Axis name="amount" title/>
          <Legend position="top" dy={-20} />
          <Tooltip />
          <Geom type="line" position="salePrice*amount" color={'key'} />
        </Chart>
        <Button onClick={this.generateMonthcountChart}>生成当前标价下(月销量-月利润)关系图</Button>
        <Chart width={500} height={500} 
          data={chartDataMonthcount} scale={scaleMonthcount}
        >
          <Axis name="predictMonthSaleCount" title/>
          <Axis name="profit" title/>
          <Legend position="top" dy={-20} />
          <Tooltip />
          <Geom type="line" position="predictMonthSaleCount*profit"  />
        </Chart>
      </div>
    );
  }
}



export default Home