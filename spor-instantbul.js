console.info("::spor-instantbul.js injected");
// >>> GLOBAL TYPE DEFINITONS
/** @typedef {"branch" | "facility" | "field"} Preference */
/** @typedef {Preference | null} AutomationState */
/** @typedef {"SELECT_BRANCH" | "SELECT_FACILITY" | "SELECT_FIELD"} MessageAction */

/**
 * @typedef {Object} DispatchOption
 * @property {MessageAction} action
 * @property {string} payload
 */

// >>> VARIABLES AND INITIAL MODIFICATIONS
let favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}

favicon.href = browser.runtime.getURL("assets/logo.png");

const branding = document.getElementsByClassName("logo-default")[0];
branding.src = browser.runtime.getURL("assets/branding.png");

/** @type {ExtensionStorage} */
const storage = browser.storage.local;
storage.get("automation").then((result) => {
	if (result == null || Object.keys(result).length === 0) {
		storage.set({ automation: null });
	}
});

// >>> LISTENERS
browser.runtime.onMessage.addListener(handleMessage);

// >>> FUNCTIONS
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

/** @param {DispatchOption} message */
function handleMessage(message) {
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
