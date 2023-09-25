import { createRoot } from 'react-dom/client'
import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { copy, checkLocalServer } from '../util'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

interface IframeItem { 
    src: string
    name: string
    localUrl: string
}

interface IframeItemExtend extends IframeItem { 
    disabled: boolean
}

function App() { 
    const [iframeArr, setIframeArr] = useState<Array<IframeItemExtend>>([])

    const refreshAllIframe = () => {
        /**
         * Q: chrome 被打包后应该被压缩了 代理里面应该不是chrome 那它是如何使用的
         * 
         */
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTabId = tabs[0].id;
            // 当前tab发送事件
            chrome.tabs.sendMessage(currentTabId, "", (res) => {
                setIframeArr(res || [])
            });
        });
    }

    useEffect(refreshAllIframe, [])

    // 复制
    const copyUrl = (text: string) => copy(text)

    // 跳转本地
    const toLocalServer = async (selectedItem: IframeItemExtend) => { 
        try {
            await checkLocalServer(selectedItem.localUrl)
            chrome.tabs.create({
                url: selectedItem.localUrl
              });
        } catch (e) {
            iframeArr.find(item => selectedItem.src === item.src).disabled = true
            console.log(iframeArr)
            setIframeArr([...iframeArr])

            toast('没有查找到本地服务器，请尝试复制链接')
        }
    }

    // 去设置
    const toSetting = () => { 
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    }

    return <div className="w-[300px] h-[400px] p-2 font-mono text-lg text-center font-semibold">
        <div className="relative text-right pd-4 flex justify-between">
            <button onClick={refreshAllIframe} className="btn-primary-round">刷新</button>
            <button className="btn-primary-round" onClick={ toSetting}>设置</button>
            <span className="absolute left-[50%] translate-x-[-50%] ">iframe标签</span>
        </div>

        <div id="iframe-container" className="overflow-auto mt-1">
        {
            iframeArr.length ? iframeArr.map((item: IframeItemExtend, index) => { 
                return <div className="iframe-item text-left m-2" key={index}>
                    <div className="text-sm">{item.name}
                        <button onClick={ () => toLocalServer(item)} disabled={item.disabled} className="btn-primary">跳转</button>
                        <button onClick={() => copyUrl(item.src)} className="btn-primary">复制</button>
                    </div>
                </div>
            }): null
            }
        </div>

        <ToastContainer  position="bottom-center" className="text-sm h-[64px]"  />
    </div>
}

const root = createRoot(document.getElementById('app'));
/**
 * App() <App /> 之间的区别
 * 
 * App() 必须要返回了一个jsx内容 否则root.render(App())会报错
 * root.render(<App />) App此处被当作一个组件来渲染
 * 
 * Yes, there is a difference between `root.render(<App />)` and `root.render(App())` in the context of React and JavaScript.

1. `root.render(<App />)`:
   - In this syntax, `<App />` is JSX syntax for rendering the `App` component.
   - It will create an instance of the `App` component and render it using React's virtual DOM reconciliation process.
   - This is the correct way to render a React component using JSX.

2. `root.render(App())`:
   - In this syntax, `App()` is a function call to the `App` component.
   - It will call the `App` component function and return its result.
   - The result will not be a React element but whatever the `App` function returns. If `App` doesn't return JSX or a React element, this will not work as expected.

In summary, to render a React component using `createRoot` and `render`, you should use the JSX syntax as shown in `root.render(<App />)`. Using `root.render(App())` is not the correct way to render a React component and may not produce the desired output unless the `App` function explicitly returns a valid React element.


 * 2. react 的更新 
    引用数据变化后 要返回一个新的数据地址 react 才能更新
*/ 
root.render(<App />);