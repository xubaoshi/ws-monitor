import React from 'react'
import ReactDOM from 'react-dom'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import 'moment/locale/zh-cn'
import 'antd/dist/antd.css'
import App from './src/app'

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('app')
)
