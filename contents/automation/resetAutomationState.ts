import { Storage } from "@plasmohq/storage";

import { automationDefault, storageKey } from "~constant";

export function resetAutomationState() {
	new Storage({
		area: "sync"
	}).setItem(storageKey.automation, automationDefault);
}
