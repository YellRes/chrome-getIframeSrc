import { createRoot } from 'react-dom/client'
import React, { useState, useEffect } from 'react'
import { Button, Table, Card, Form, Input, Row, Col } from 'antd'
// TODO: 能否提取成为公共样式
import '../popup/index.css'

function AddServerUrlForm() {
    return <Card >
        <Form
            name="searchAndAdd"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            
            <Row>
             <Col span={10}>
                    <Form.Item label={'在线服务器地址'}>
                        <Input></Input>
                    </Form.Item>
                    </Col>

                <Col span={10}>
                    <Form.Item label={'本地服务器地址'}>
                        <Input></Input>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Button className="ml-2">查询</Button>
                    <Button className="ml-2">新增</Button>
                </Col>
                
            </Row>

        </Form>
           
        </Card>
    
}

/**
 * table 
 *
*/
const columns = [
    {
        title: '线上url',
        dataIndex: 'name',
        key: 'name',
        // render: (text) => <a>{text}</a>,
      },
      {
        title: '本地url地址',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
]

function ServerUrlTable() {
    return <></>
}

function App() {
    return <div className="p-2">
        <AddServerUrlForm />
        <ServerUrlTable />
    </div>
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
