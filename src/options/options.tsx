import { createRoot } from 'react-dom/client'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { Button, Table, Card, Form, Input, Row, Col, Popconfirm, Modal, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import { v4  } from 'uuid'
import { getAllStorage, setStorage  } from '../store'
// TODO: 能否提取成为公共样式
import '../popup/index.css'

interface IServerItem {
    id: string;
    remoteUrl: string;
    localUrl: string
}

const StorageContext = createContext(null)
function AddServerUrlForm(props) {

    const { refreshTable, filterTable } = props
    const [ localUrl, setLocalUrl ] = useState('')
    const [ remoteUrl, setRemoteUrl ] = useState('')

    const search = () => {
        filterTable({localUrl, remoteUrl})        
    }
    const reset = () => { 
        setLocalUrl('')
        setRemoteUrl('')
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
                        <Input onChange={e => setRemoteUrl(e.target.value)} value={remoteUrl} />
                    </Form.Item>
                </Col>

                <Col span={10}>
                    <Form.Item label={'本地服务器地址'}>
                        <Input onChange={e => setLocalUrl(e.target.value)} value={localUrl} />
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Button className="ml-2" type="primary" onClick={ search }>查询</Button>
                    <Button className="ml-2" onClick={ reset }>重置</Button>
                    <Button className="ml-2" onClick={ add }>新增</Button>
                </Col> 
            </Row>

        </Form>
           
        </Card>
}

function ServerUrlTable() {
    const { dataSource, refreshTable } = useContext(StorageContext)
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
                    onConfirm={() => deleteRow(record)}
                  >
                    <Button type="text">删除</Button>
                  </Popconfirm>
              </> 
          },
    ]
    const deleteRow = async (record: IServerItem) => {
        const { id } = record
        await setStorage(dataSource.filter(item => item.id !== id))
        refreshTable()
    }
    const editRow = (record: IServerItem) => { 
        const { remoteUrl, localUrl, id } = record
        setLocalUrl(localUrl)
        setRemoteUrl(remoteUrl)
        setId(id)
        setModelOpen(true)
    }
    

    /**
     * model
    */
    const [isModelOpen, setModelOpen] = useState(false)
    const handleOk = async () => { 
        let dataItem = dataSource.find(item => item.id === id)
        dataItem.localUrl = localUrl
        dataItem.remoteUrl = remoteUrl
        await setStorage(dataSource)
        refreshTable()
        setModelOpen(false)
    }
    const handleCancel = () => {
        setModelOpen(false)
        setLocalUrl('')
        setRemoteUrl('')
     }

    /**
     * form
    */
    const [ localUrl, setLocalUrl ] = useState('')
    const [remoteUrl, setRemoteUrl] = useState('')
    const [id, setId] = useState('')
    return <>
        <Modal title="编辑" open={isModelOpen} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Row size='small'>
                <Col span={12}>
                    <Form.Item label={'在线服务器地址'}>
                        <Input onChange={e => setRemoteUrl(e.target.value)} value={remoteUrl} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label={'本地服务器地址'}>
                        <Input onChange={e => setLocalUrl(e.target.value)} value={localUrl} />
                    </Form.Item>
                </Col>
            </Row>

    
        </Modal>

        <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </> 
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
        <StorageContext.Provider value={{dataSource, setDataSource, refreshTable: fetchData}}>
            <AddServerUrlForm refreshTable={fetchData} filterTable={filterTable} />
            <ServerUrlTable  />
        </StorageContext.Provider>
    </div>
}

const root = createRoot(document.getElementById('app'));
root.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
);
