console.info("::spor-instantbul.js injected");
// >>> GLOBAL TYPE DEFINITONS
/** @typedef {"branch" | "facility" | "field"} Preference */
/** @typedef {"reservation" | "to_cart"} ReservationProcess */
/** @typedef {Preference | ReservationProcess | null} AutomationState */
/** @typedef {"SELECT_BRANCH" | "SELECT_FACILITY" | "SELECT_FIELD" | "ADD_RESERVATION" | "ADD_TO_CART"} MessageAction */

/**
 * @typedef {Object} DispatchOption
 * @property {MessageAction} action
 * @property {string | undefined} payload
 */

// >>> VARIABLES AND INITIAL MODIFICATIONS
let reservationOptionsContainerExistsTimeout;
let reservationOptionLocatorRetries = 0;
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
	select.value = newValue;
	select.dispatchEvent(new Event("change")); // spor.istanbul component listens for "change" event to move to the next step
}

function addReservation() {
	const reservationLinks = document.querySelectorAll(".form-group > .well.wellPlus > a[title='Rezervasyon']");
	const latestReservation = reservationLinks[reservationLinks.length - 1];
	latestReservation.removeAttribute("onclick");
	latestReservation.click();

	chooseReservationType();
}

function chooseReservationType() {
	clearTimeout(reservationOptionsContainerExistsTimeout);
	const courtReservationOption = document.getElementById("rblKiralikTenisSatisTuru_2");

	if (courtReservationOption == null && reservationOptionLocatorRetries < 5) {
		reservationOptionLocatorRetries += 1;
		reservationOptionsContainerExistsTimeout = setTimeout(chooseReservationType, 500);
	} else {
		courtReservationOption?.click();
	}
}

function markAsRead() {
	const checkbox = document.getElementById("pageContent_cboxKiralikSatisSozlesmesi");
	checkbox.checked = true;
}

function addToCart() {
	markAsRead();
	const addToCartButton = document.getElementById("pageContent_lbtnSepeteEkle");
	addToCartButton.click();
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
		case "ADD_RESERVATION":
			addReservation();
			break;
		case "ADD_TO_CART":
			addToCart();
			break;
		default:
			console.error("spor-instantbul - unhandled action:", message.action);
			break;
	}
}
