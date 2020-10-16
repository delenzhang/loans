import React, { useState } from "react";
import Form from 'antd/es/form'
import InputNumber from 'antd/es/input-number'
import Button from 'antd/es/button'
import ConfigProvider from 'antd/es/config-provider'
// import { Form, InputNumber, Button, ConfigProvider } from "antd";
import Area from "@ant-design/charts/es/area";
import compute from "./utils";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import "antd/dist/antd.css";
import "./App.css";

moment.locale("zh-cn");

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 22 },
};
const initialValues = {
  totalMoney: 100,
  mortgageInterest: 5,
  rate: 5,
  totalYear: 30,
};

function App() {
  const [data, setData ] = useState(null);
  const onFinish = (values) => {
    console.log("Success:", values);
    let json = compute(values);
    console.log(json, 12121);
    setData(json);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const config = {
    data,
    height: 600,
    xField: "date",
    yField: "value",
    seriesField: "title",
    xAxis: { tickCount: 100 },
    // slider: {
    //   start: 1,
    //   end: 9,
    // },
  };
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <header className="App-header">
          <h1>房贷方式（等额本息和等额本金）与投资利率换算</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="贷款金额">
              <Form.Item
                noStyle
                name="totalMoney"
                rules={[{ required: true, message: "必须输入贷款金额！" }]}
              >
                <InputNumber min={1} />
              </Form.Item>
              <span className="ant-form-text">万元</span>
            </Form.Item>

            <Form.Item label="贷款利息">
              <Form.Item
                name="mortgageInterest"
                rules={[{ required: true, message: "必须输入贷款利息！" }]}
                noStyle
              >
                <InputNumber min={1} initialValues={5} defaultValue={5} />
              </Form.Item>
              <span className="ant-form-text"> %</span>
            </Form.Item>

            <Form.Item label="贷款年限">
              <Form.Item
                name="totalYear"
                rules={[{ required: true, message: "必须输入贷款年限！" }]}
                noStyle
              >
                <InputNumber min={1} initialValues={30} defaultValue={30} />
              </Form.Item>
              <span className="ant-form-text"> 年</span>
            </Form.Item>

            <Form.Item label="投资年化回报">
              <Form.Item
                name="rate"
                rules={[{ required: true, message: "必须输入 投资年化回报！" }]}
                noStyle
              >
                <InputNumber min={0} initialValues={5} defaultValue={5} />
              </Form.Item>
              <span className="ant-form-text"> %</span>
            </Form.Item>

            <Form.Item>
              <Button type="primary" block htmlType="submit" size="large">
                提交
              </Button>
            </Form.Item>
          </Form>
          <div className="code_wrapper">
            <code id="code"> </code>
          </div>
        </header>
        {data ? <Area {...config} /> : null}
      </div>
    </ConfigProvider>
  );
}

export default App;
