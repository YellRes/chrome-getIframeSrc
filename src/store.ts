/**
 * store
 * */

// get
export const getAllStorage = async () => {
  try {
    let res = await chrome.storage.local.get(["urlArr"]);
    return res;
  } catch (e) {
    console.warn(e);
  }
};

// set
export const setStorage = async (value) => {
  await chrome.storage.local.set({
    urlArr: value,
  });
};
