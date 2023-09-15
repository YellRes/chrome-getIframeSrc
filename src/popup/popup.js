let iframeArr = [];

let handleEvent = () => {
  let refreshDom = document.querySelector("#refreshDom");

  refreshDom.addEventListener(
    "click",
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0].id;
        // 当前tab发送事件
        chrome.tabs.sendMessage(currentTabId, "", (res) => {
          iframeArr = res;
          generateDom();
        });
      });
    },
    false
  );

  document.querySelector("#container").addEventListener(
    "click",
    (e) => {
      console.log(e.target);
      if (e.target.tagName === "LI") {
        let targetSrc = e.target.getAttribute("data-src");
        copy(targetSrc);
        // 新的tab打开
      }
    },
    false
  );
};

const generateDom = () => {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < iframeArr.length; i++) {
    const div = document.createElement("div");

    // li
    let li = document.createElement("li");
    li.textContent = iframeArr[i].name;
    li.setAttribute("data-src", iframeArr[i].src);

    // button
    let button = document.createElement("button");
    button.textContent = "跳转";
    button.setAttribute("data-src", iframeArr[i].localUrl);

    div.append(...[li, button]);
    fragment.appendChild(div);
  }

  document.querySelector("#container").appendChild(fragment);
};
function copy(text) {
  let tmpTextarea = document.createElement("textarea");
  tmpTextarea.value = text;
  document.body.appendChild(tmpTextarea);
  tmpTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tmpTextarea);
}

document.addEventListener("DOMContentLoaded", handleEvent);
