import { createRoot } from 'react-dom/client'
import React from 'react'

function App() { 
    return <div>this is app</div>
}
const root = createRoot(document.getElementById('app'));
root.render(App());