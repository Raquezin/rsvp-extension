chrome.action.onClicked.addListener(async (tab) => {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText.trim()
    });
    const text = results[0].result;
    await chrome.storage.session.set({ pageText: text });
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  } catch (error) {
    console.error('Error extracting text:', error);
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  }
});