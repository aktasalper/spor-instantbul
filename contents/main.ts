import type { PlasmoCSConfig } from "plasmo";
import type { ValueOf } from "type-fest";

import { Storage } from "@plasmohq/storage";

import { getPage } from "~utils/getPage";
import { isAutomationPage } from "~utils/isAutomationPage";

import Branding from "url:../assets/branding.png";
import Logo from "url:../assets/icon.png";

import { automationDefault, storageKey } from "~constant";

const currentPage = getPage();

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
const reservationSelectionSteps: Array<AutomationState["satiskiralik"]> = ["branch", "facility", "field"];
const storage = new Storage({
	area: "sync"
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.name === "automate" && isAutomationPage(currentPage)) {
		let overrideState: ValueOf<AutomationState>;
		if (currentPage === "satiskiralik") {
			overrideState = "branch";
		} else if (currentPage === "uyeseanssecim") {
			overrideState = "facility";
		}

		storage.getItem<AutomationState>(storageKey.automation).then((state) => {
			storage
				.setItem(storageKey.automation, { ...state, [currentPage]: overrideState })
				.then(delegateAutomationForCurrentPage);
		});
	}
});

if (isAutomationPage(currentPage)) {
	storage.getItem<AutomationState>(storageKey.automation).then((state) => {
		if (state == null) {
			storage.setItem(storageKey.automation, automationDefault);
		} else {
			delegateAutomationForCurrentPage();
		}
	});
}

function getPostBackFnString(el: HTMLAnchorElement) {
	return el.href.replace("javascript:", "");
}

function resetAutomationState() {
	storage.setItem(storageKey.automation, automationDefault);
}

function delegateAutomationForCurrentPage() {
	storage.getItem<AutomationState>(storageKey.automation).then((state) => {
		if (currentPage === "satiskiralik") {
			handleReservationAutomation(state.satiskiralik);
		} else if (currentPage === "uyeseanssecim") {
			handleSessionResAutomation(state.uyeseanssecim);
		}
	});
}

function changeSelectValue(selector: string, newValue: string) {
	const select = document.getElementById(selector) as HTMLSelectElement;
	const options = Array.from(select.children) as Array<HTMLOptionElement>;

	const userSelection = options.find((opt) => opt.value === newValue);

	if (userSelection != null) {
		select.value = newValue;
		select.dispatchEvent(new Event("change")); // spor.istanbul component listens for "change" event to move to the next step
	} else {
		resetAutomationState();
		alert(
			`${selector} için ${newValue} seçeneği bulunamadı! Sunulan seçeneklerin değerleri değişmiş olabilir. Otomasyon işlemi durduruldu. Eğer sorun devam ederse lütfen benimle iletişime geçin.`
		);
	}
}

async function handleReservationAutomation(step: AutomationState["satiskiralik"]) {
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

async function handleSessionResAutomation(step: AutomationState["uyeseanssecim"]) {
	if (step !== null) {
		const nextStep = getNextSessionStep(step);
		const state = await storage.getItem<AutomationState>(storageKey.automation);
		await storage.setItem(storageKey.automation, { ...state, [currentPage]: nextStep });

		if (step === "facility") {
			const facilityPreference = await storage.getItem<SessionPreference>(storageKey.sessionResPreference);

			if (facilityPreference) {
				handleDispatch({ action: `SELECT_FACILITY`, payload: facilityPreference });
			} else {
				resetAutomationState();
				alert("No facility preference found for session");
			}
		} else if (step === "captcha") {
			// TODO: may need to handle something here
		} else {
			handleDispatch({ action: `SELECT_${step.toUpperCase() as Uppercase<SessionReservationProcess>}` });
		}
	}
}

function getNextSessionStep(currentStep: AutomationState["uyeseanssecim"]) {
	let nextStep: AutomationState["uyeseanssecim"];
	switch (currentStep) {
		case null:
			nextStep = "facility";
			break;
		case "facility":
			nextStep = "check";
			break;
		case "check":
			nextStep = "confirm";
			break;
		case "confirm":
			nextStep = "captcha";
			break;
		case "captcha":
			nextStep = "save";
			break;
		case "save":
		default:
			nextStep = null;
	}

	return nextStep;
}

function checkSession() {
	const checkmarks = document.querySelectorAll("span[commandname='Sec'] > input");

	if (checkmarks.length === 0) {
		resetAutomationState();
		alert("Rezervasyona açık seans bulunamadı!");
	} else {
		const lastCheckMark = checkmarks[checkmarks.length - 1] as HTMLInputElement;
		lastCheckMark.checked = true;
		lastCheckMark.dispatchEvent(new Event("change"));
		lastCheckMark.dispatchEvent(new Event("click"));
	}
}

function confirmSession() {
	const input = document.getElementById("pageContent_cboxOnay") as HTMLInputElement;
	input.checked = true;

	focusCaptcha();
}

const validationInput = document.createElement("input");

function focusCaptcha() {
	validationInput.id = "spor-instantbul-recaptcha-valid";
	validationInput.type = "checkbox";
	validationInput.checked = false;
	validationInput.hidden = true;

	document.body.appendChild(validationInput);

	const captcha = document.getElementsByClassName("g-recaptcha")[0] as HTMLDivElement;
	captcha.style.outline = "5px solid red";
	captcha.style.boxShadow = "-2px 3px 16px 13px red";

	checkCaptchaValidated();
}

let validationTimeout: NodeJS.Timeout;
function checkCaptchaValidated() {
	clearTimeout(validationTimeout);

	validationTimeout = setTimeout(() => {
		if (validationInput.checked) {
			saveSession();
		} else {
			checkCaptchaValidated();
		}
	}, 250);
}

function saveSession() {
	const button = document.getElementById("lbtnKaydet") as HTMLAnchorElement;

	const anchorOverride = document.createElement("a");
	anchorOverride.setAttribute("onclick", getPostBackFnString(button));

	button.parentElement.appendChild(anchorOverride);
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
		case "SELECT_CHECK":
			checkSession();
			break;
		case "SELECT_CONFIRM":
			confirmSession();
			break;
		case "ADD_RESERVATION":
			addReservation();
			break;
		case "ADD_TO_CART":
			addToCart();
			break;
		case "SELECT_CAPTCHA":
		case "SELECT_SAVE":
		default:
			console.error("spor-instantbul - unhandled action:", message.action);
			break;
	}
}

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/*"]
};
