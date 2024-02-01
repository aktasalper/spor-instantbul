import type { ValueOf } from "type-fest";

import { Storage } from "@plasmohq/storage";

import { getPage } from "~utils/getPage";
import { isAutomationPage } from "~utils/isAutomationPage";

import { handleReservationAutomation } from "./handleReservation";
import { handleSessionResAutomation } from "./handleSessionResAutomation";

import { automationDefault, storageKey } from "~constant";

const storage = new Storage({
	area: "sync"
});

const currentPage = getPage();

chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
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

function delegateAutomationForCurrentPage() {
	storage.getItem<AutomationState>(storageKey.automation).then((state) => {
		if (currentPage === "satiskiralik") {
			handleReservationAutomation(state.satiskiralik);
		} else if (currentPage === "uyeseanssecim") {
			handleSessionResAutomation(state.uyeseanssecim);
		}
	});
}
