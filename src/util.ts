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

export function getPortalSiteCookies() {
  var cookies = {};
  var cookieString = document.cookie;
  var cookieArray = cookieString.split("; ");

  for (var i = 0; i < cookieArray.length; i++) {
    var parts = cookieArray[i].split("=");
    var name = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);
    cookies[name] = value;
  }

  return cookies["portalTokenTest"];
}

export function checkIfPortalSite() {
  return window.location.hostname.includes("portal.test.greatld.com");
}
