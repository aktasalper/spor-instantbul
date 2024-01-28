import { automationPages } from "~constant";

export function isAutomationPage(page: string): page is AutomationPage {
	return automationPages.has(page as any);
}
