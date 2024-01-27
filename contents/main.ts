import type { PlasmoCSConfig } from "plasmo";

import { Storage } from "@plasmohq/storage";

import Branding from "url:../assets/branding.png";
import Logo from "url:../assets/icon.png";
import { storageKey } from "~constant";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.name === "automate") {
		handleAutomationState("branch");
	}
});

let favicon: HTMLLinkElement = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}
favicon.href = Logo;

const branding = document.getElementsByClassName("logo-default")[0] as HTMLImageElement;
branding.src = Branding;

let reservationOptionsContainerExistsTimeout: NodeJS.Timeout;
let reservationOptionLocatorRetries = 0;
const selectionSteps: Array<AutomationState> = ["branch", "facility", "field"];
const storage = new Storage({
	area: "sync"
});

storage.getItem<AutomationState>(storageKey.automation).then(handleAutomationState);

async function handleAutomationState(step: AutomationState) {
	if (step === undefined) {
		storage.setItem(storageKey.automation, null);
	} else if (step !== null) {
		const nextStep = getNextAutomationStep(step);
		await storage.setItem(storageKey.automation, nextStep);

		const preferences = await storage.getItem<PreferenceObject>(storageKey.preferences);

		if (preferences != null) {
			if (selectionSteps.includes(step)) {
				const payload = preferences[step].value;

				handleDispatch({ action: `SELECT_${step.toUpperCase() as Uppercase<Preference>}`, payload });
			} else {
				handleDispatch({ action: `ADD_${step.toUpperCase() as Uppercase<ReservationProcess>}` });
			}
		} else {
			resetAutomationState();
			alert("No preference found");
		}
	}
}

function resetAutomationState() {
	storage.setItem(storageKey.automation, null);
}

function getNextAutomationStep(currentStep: AutomationState) {
	let nextStep: AutomationState;
	switch (currentStep) {
		case null:
			nextStep = "branch";
			break;
		case "branch":
			nextStep = "facility";
			break;
		case "facility":
			nextStep = "field";
			break;
		case "field":
			nextStep = "reservation";
			break;
		case "reservation":
			nextStep = "to_cart";
			break;
		case "to_cart":
		default:
			nextStep = null;
	}

	return nextStep;
}

function changeSelectValue(selector: string, newValue: string) {
	const select = document.getElementById(selector) as HTMLSelectElement;
	select.value = newValue;
	select.dispatchEvent(new Event("change")); // spor.istanbul component listens for "change" event to move to the next step
}

function addReservation() {
	const reservationLinks = document.querySelectorAll(".form-group > .well.wellPlus > a[title='Rezervasyon']");

	if (reservationLinks.length) {
		const lastResAnchor = reservationLinks[reservationLinks.length - 1] as HTMLAnchorElement;

		const anchorOverride = document.createElement("a");
		anchorOverride.setAttribute("onclick", getPostBackFnString(lastResAnchor));

		lastResAnchor.parentElement.appendChild(anchorOverride);
		anchorOverride.click();

		chooseReservationType();
	} else {
		resetAutomationState();
		alert("Arama kriterleriniz kapsamında alınabilir rezervasyon bulunamadı!");
	}
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
	const checkbox = document.getElementById("pageContent_cboxKiralikSatisSozlesmesi") as HTMLInputElement;
	checkbox.checked = true;
}

function addToCart() {
	markAsRead();
	const addToCartAnchor = document.getElementById("pageContent_lbtnSepeteEkle") as HTMLAnchorElement;

	const anchorOverride = document.createElement("a");
	anchorOverride.setAttribute("onclick", getPostBackFnString(addToCartAnchor));

	addToCartAnchor.parentElement.appendChild(anchorOverride);
	anchorOverride.click();
}

function handleDispatch(message: DispatchOption) {
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

function getPostBackFnString(el: HTMLAnchorElement) {
	return el.href.replace("javascript:", "");
}

export const config: PlasmoCSConfig = {
	matches: ["*://*.spor.istanbul/*"]
};
