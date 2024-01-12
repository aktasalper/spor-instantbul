/**
 * @typedef {"branch" | "facility" | "field"} Preference
 */

/**
 * @typedef {"SELECT_BRANCH" | "SELECT_FACILITY" | "SELECT_FIELD"} MessageAction
 */

/**
 * @typedef {Object} DispatchOption
 * @property {MessageAction} action
 * @property {string} payload
 */

/**
 * @param {string} selector
 * @param {string} newValue
 */
function changeSelectValue(selector, newValue) {
	const select = document.getElementById(selector);

	select.value = newValue;
	select.dispatchEvent(new Event("change")); // spor.istanbul component listens for "change" event to move to the next step
}

/**
 * @param {DispatchOption} message
 */
function handleMessage(message) {
	console.log("message received:", message);
	switch (message.action) {
		case "SELECT_BRANCH":
			changeSelectValue("ddlBransFiltre", message.payload);
			break;
		case "SELECT_FACILITY":
			changeSelectValue("ddlTesisFiltre", message.payload);
			break;
		case "SELECT_FIELD":
			changeSelectValue("ddlSalonFiltre", message.payload);
			break;
		default:
			console.error("spor-instantbul - unhandled action:", message.action);
			break;
	}
}

(() => {
	if (window.hasRun) {
		return;
	}

	window.hasRun = true;
	browser.runtime.onMessage.addListener(handleMessage);
	window.addEventListener("unload", () => browser.runtime.sendMessage("UNLOAD"));
	window.addEventListener("load", () => {
		console.log("DOM LOADED!'!!!!");
	});
})();
