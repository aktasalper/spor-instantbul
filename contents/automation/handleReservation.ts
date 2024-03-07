import { Storage } from "@plasmohq/storage";

import { getPostBackFnString } from "~utils/getPostBackFnString";
import { getPage } from "~utils/getPage";

import { changeSelectValue } from "./changeSelectValue";
import { resetAutomationState } from "./resetAutomationState";

import { storageKey } from "~constant";

let reservationOptionsContainerExistsTimeout: NodeJS.Timeout;
let reservationOptionLocatorRetries = 0;
const reservationSelectionSteps: Array<AutomationState["satiskiralik"]> = ["branch", "facility", "field"];
const currentPage = getPage();
const storage = new Storage({
	area: "sync"
});

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

function getNextReservationStep(currentStep: AutomationState["satiskiralik"]) {
	let nextStep: AutomationState["satiskiralik"];
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

export async function handleReservationAutomation(step: AutomationState["satiskiralik"]) {
	if (step !== null) {
		const nextStep = getNextReservationStep(step);
		const state = await storage.getItem<AutomationState>(storageKey.automation);
		await storage.setItem(storageKey.automation, { ...state, [currentPage]: nextStep });

		const preferences = await storage.getItem<ReservationPreferences>(storageKey.preferences);

		if (preferences != null) {
			if (reservationSelectionSteps.includes(step)) {
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