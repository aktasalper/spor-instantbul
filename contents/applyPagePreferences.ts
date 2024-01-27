import type { PlasmoCSConfig } from "plasmo";
import type { StringKeyOf } from "type-fest";
import type { PagePreferences } from "~options/default";

import { Storage } from "@plasmohq/storage";

import { storageKey } from "~constant";

const storage = new Storage({
	area: "sync"
});

storage.getItem<PagePreferences>(storageKey.pagePreferences).then(handlePagePreference);

function getPage() {
	return window.location.href.split(".istanbul/")[1].split("/")[0];
}

function handlePagePreference(preferences: PagePreferences) {
	const page = getPage();
	if (Object.keys(preferences).includes(page)) {
		switch (page as StringKeyOf<PagePreferences>) {
			case "anasayfa":
				handleAnasayfaPreferences(preferences.anasayfa);
				break;
			case "satiskiralik":
				handleSatiskiralikPreferences(preferences.satiskiralik);
				break;
			default:
				console.error("Unhandled page preference:", page);
		}
	}
}

function handleAnasayfaPreferences(preferences: PagePreferences["anasayfa"]) {
	if (preferences["hide-modal"]) {
		const linkElement = document.createElement("link");
		linkElement.setAttribute("rel", "stylesheet");
		linkElement.setAttribute("type", "text/css");
		linkElement.setAttribute(
			"href",
			"data:text/css;charset=UTF-8," + encodeURIComponent(".modal, .modal-backdrop {display: none !important;};")
		);

		document.head.appendChild(linkElement);
	}
}

function handleSatiskiralikPreferences(preferences: PagePreferences["satiskiralik"]) {
	if (preferences["hide-warning"]) {
		const warning = document.getElementById("divBildirim");

		warning.remove();
	}
}

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/*"]
};
