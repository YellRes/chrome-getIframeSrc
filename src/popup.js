export const getAllIframeSrc = () => {
  const iframes = document.querySelectorAll("iframe");
  const iframeSrc = [];
  iframes.forEach((iframe) => {
    iframeSrc.push(iframe.src);
  });
  return iframeSrc;
};
const init = () => {
  console.log(getAllIframeSrc());
};

document.addEventListener("DOMContentLoaded", () => {
  const refreshDom = document.querySelector("#refreshDom");
  refreshDom.addEventListener("click", init);
});
