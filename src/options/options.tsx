import { createRoot } from 'react-dom/client'
import React, { useState, useEffect } from 'react'
import { Button, Table, Card, Form, Input, Row, Col, Popconfirm } from 'antd'
import { v4  } from 'uuid'
import { getAllStorage, setStorage  } from '../store'
// TODO: 能否提取成为公共样式
import '../popup/index.css'

interface IServerItem {
    id: string;
    remoteUrl: string;
    localUrl: string
}

function AddServerUrlForm(props) {

    const { refreshTable, filterTable } = props
    const [ localUrl, setLocalUrl ] = useState('')
    const [ remoteUrl, setRemoteUrl ] = useState('')

    const search = () => {
        filterTable({localUrl, remoteUrl})        
    }
    const reset = () => { 
        setLocalUrl()
        setRemoteUrl()
        refreshTable()
    } 
    const add = async () => {
        let res = await getAllStorage()
        await setStorage([...res.urlArr, {id: v4(), localUrl, remoteUrl}])
        refreshTable()
    }

    return <Card >
        <Form
            name="searchAndAdd"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            
            <Row>
                <Col span={10}>
                    <Form.Item label={'在线服务器地址'}>
                        <Input onChange={e => setRemoteUrl(e.target.value) } />
                    </Form.Item>
                </Col>

                <Col span={10}>
                    <Form.Item label={'本地服务器地址'}>
                        <Input onChange={e => setLocalUrl(e.target.value)} />
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Button className="ml-2" onClick={ search }>查询</Button>
                    <Button className="ml-2" onClick={ reset }>重置</Button>
                    <Button className="ml-2" onClick={ add }>新增</Button>
                </Col> 
            </Row>

        </Form>
           
        </Card>
}

function ServerUrlTable({ dataSource }) {
    
    const columns = [
        {
            title: '线上url',
            dataIndex: 'remoteUrl',
            key: 'remoteUrl',
          },
          {
            title: '本地url地址',
            dataIndex: 'localUrl',
            key: 'localUrl',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
              render: (text, record) => <>
                  <Button type="text" onClick={() => editRow(record)}>编辑</Button>
                  <Popconfirm
                    title="删除"
                    description="确认删除?"
                    onConfirm={confirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text">删除</Button>
                  </Popconfirm>
              </> 
          },
    ]
    const confirm = () => { 
    }
    const editRow = (row: any) => {}
    const deleteRow = (row: any) => {

    }
    return <Table dataSource={dataSource} columns={columns} />
}

function App() {
    const [dataSource, setDataSource] = useState<Array<IServerItem>>([])
    async function fetchData() { 
        let res = await getAllStorage()
        console.log(res?.urlArr, 'res?.urlArr')
        setDataSource(res?.urlArr || [])
    }

    function filterTable(val: IServerItem) { 
        const {remoteUrl, localUrl } = val
        setDataSource(dataSource.filter(item => item.remoteUrl.includes(remoteUrl) && item.localUrl.includes(localUrl)))
    }

    useEffect(() => {  
        fetchData()
    }, [])

    return <div className="p-2">
        <AddServerUrlForm refreshTable={fetchData} filterTable={filterTable} />
        <ServerUrlTable dataSource={ dataSource } />
    </div>
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
