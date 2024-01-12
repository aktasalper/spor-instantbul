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

let favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}

favicon.href = browser.runtime.getURL("assets/logo.png");

const branding = document.getElementsByClassName("logo-default")[0];
branding.src = browser.runtime.getURL("assets/branding.png");

browser.runtime.onMessage.addListener(handleMessage);

/**
 * @param {string} selector
 * @param {string} newValue
 */
function changeSelectValue(selector, newValue) {
	const select = document.getElementById(selector);
	console.log("🚀 ~ changeSelectValue ~ select:", select);

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
