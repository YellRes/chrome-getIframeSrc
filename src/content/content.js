const TEST_BOSS_VIEW = "http://101.37.228.6:88";
const PRD_BOSS_VIEW = "https://sso-boss-extend.greatld.com";
const TEST_BOSS_VIEW_V3 = "http://101.37.228.6:96";
const PRD_BOSS_VIEW_V3 = "https://boss-web-v3.greatld.com";

const LOCAL_BOSS_VIEW = "http://localhost:4000";
const LOCAL_BOSS_VIEW_V3 = "http://localhost:3210";

const MATCH_PRE_HTTP = [
  PRD_BOSS_VIEW,
  PRD_BOSS_VIEW_V3,
  TEST_BOSS_VIEW_V3,
  TEST_BOSS_VIEW,
];

let WEBSITE_LOCAL_PORT = {
  [TEST_BOSS_VIEW]: LOCAL_BOSS_VIEW,
  [PRD_BOSS_VIEW]: LOCAL_BOSS_VIEW,
  [TEST_BOSS_VIEW_V3]: LOCAL_BOSS_VIEW_V3,
  [PRD_BOSS_VIEW_V3]: LOCAL_BOSS_VIEW_V3,
};

const getAllIframeSrc = () => {
  const liArr = document.querySelectorAll(".ma_taps > li");
  const matchedIframes = [...liArr].filter((liDom) =>
    MATCH_PRE_HTTP.some((matchItem) =>
      liDom.getAttribute("tab-id").startsWith(matchItem)
    )
  );

  return matchedIframes;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let infoArr = getAllIframeSrc().map((liDom) => {
    const path = liDom
      .getAttribute("tab-id")
      .match(/[/]{1}[^/]*\?__timestamp__=[\w\W]*/g)[0];
    return {
      src: path ? path : "",
      name: liDom.querySelector("span").textContent,
      localUrl:
        WEBSITE_LOCAL_PORT[liDom.getAttribute("tab-id").replace(path, "")] +
        path,
    };
  });
  sendResponse(infoArr);
});
