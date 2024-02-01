import { Storage } from "@plasmohq/storage";

import { getPostBackFnString } from "~utils/getPostBackFnString";
import { getPage } from "~utils/getPage";

import { changeSelectValue } from "./changeSelectValue";
import { resetAutomationState } from "./resetAutomationState";

import { storageKey } from "~constant";

const currentPage = getPage();
const storage = new Storage({
	area: "sync"
});

function handleDispatch(message: DispatchOption) {
	switch (message.action) {
		case "SELECT_FACILITY":
			changeSelectValue("ddlTesisFiltre", message.payload);
			break;
		case "SELECT_CHECK":
			checkSession();
			break;
		case "SELECT_CONFIRM":
			confirmSession();
			break;
		case "SELECT_CAPTCHA":
		case "SELECT_SAVE":
		default:
			console.error("spor-instantbul - unhandled action:", message.action);
			break;
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

export async function handleSessionResAutomation(step: AutomationState["uyeseanssecim"]) {
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
