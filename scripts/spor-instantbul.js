/**
 * @typedef {"branch" | "facility"} Preference
 */

/**
 * @typedef {"SELECT_BRANCH" | "SELECT_FACILITY"} MessageAction
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
 * @param {string} selector
 * @param {string} newValue
 */
function changeSelectValue(selector, newValue) {
	const select = document.getElementById(selector);
	console.log("setting select value:", { newValue, select });
	select.value = newValue;
	select.dispatchEvent(new Event("change"));
}

/**
 * @param {DispatchOption} message
 */
function handleMessage(message) {
	switch (message.action) {
		case "SELECT_BRANCH":
			changeSelectValue("ddlBransFiltre", message.payload);
			break;
		case "SELECT_FACILITY":
			changeSelectValue("ddlTesisFiltre", message.payload);
			break;
		default:
			break;
	}
}

(() => {
	if (window.hasRun) {
		return;
	}

	window.hasRun = true;
	browser.runtime.onMessage.addListener(handleMessage);
})();
