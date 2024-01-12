console.info("<<<<< BACKGROUND SCRIPT >>>>");
const filter = {
	properties: ["status"],
	urls: ["*://*.spor.istanbul/*"]
};

/**
 * @param {number} tabID
 * @param {{status: TabStatus}} info
 */
function handleTabUpdate(_tabID, info) {
	browser.runtime.sendMessage(info.status);
}

browser.tabs.onUpdated.addListener(handleTabUpdate, filter);
