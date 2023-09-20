import { createRoot } from 'react-dom/client'
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'antd'

function AddServerUrlForm() {
    return <>
        <Button type="primary" >查询</Button>
        <Button className="ml-4">新增</Button>
    </>
}

function ServerUrlTable() {
    return <></>
}

function App() {
    return <>
        <AddServerUrlForm />
        <ServerUrlTable />
    </>
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
