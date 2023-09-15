export const checkLocalServer = async (localServerUrl) => {
  try {
    await fetch(localServerUrl);
    return true;
  } catch (e) {
    console.warn(e);
    return Promise.reject(e);
  }
};
export function copy(text) {
  let tmpTextarea = document.createElement("textarea");
  tmpTextarea.value = text;
  document.body.appendChild(tmpTextarea);
  tmpTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tmpTextarea);
}
