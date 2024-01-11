/**
 * @typedef {"SELECT_BRANCH"} MessageAction
 */

/**
 * @typedef {Object} DispatchOption
 * @property {MessageAction} action
 * @property {string} payload
 */

/**
 * @param {string} selector
 * @returns {HTMLSpanElement}
 */
function getSelectSpan(selector) {
	return document.querySelector(`span[aria-labelledby="${selector}"]`);
}

/**
 * @param {string} branchVal
 */
function selectBranch(branchVal) {
	const span = getSelectSpan("select2-ddlBransFiltre-container");
	console.log("branch span:", span);

	const select = document.getElementById("ddlBransFiltre");
	console.log("setting select value:", { branchVal, select });
	select.value = branchVal;
	select.dispatchEvent(new Event("change"));
}

/**
 * @param {DispatchOption} message
 */
function handleMessage(message) {
	switch (message.action) {
		case "SELECT_BRANCH":
			selectBranch(message.payload);
			break;
		default:
			break;
	}
}

(() => {
	if (window.hasRun) {
		return;
	}

	console.info("::content_script initialized");
	window.hasRun = true;

	browser.runtime.onMessage.addListener(handleMessage);
})();
