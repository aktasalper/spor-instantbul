async function getActiveTabs() {
	return browser.tabs.query({ active: true, currentWindow: true });
}

async function initializePopup() {
	try {
		const tabs = await getActiveTabs();

		const currentTab = tabs[0].id;
		const select = document.getElementsByTagName("select")[0];

		select.addEventListener("change", (e) => {
			browser.tabs.sendMessage(currentTab, { val: e.target.value });
		});
	} catch (error) {
		logError(error);
	}
}

function handleExecutionError(error) {
	console.info("\t::handleExecutionError -", error);
	console.error(`Failed to initialize pop-up script: ${error.message}`);
}

function logError(error) {
	console.error(`Could not execute "spor-instantbul.js": ${error}`);
}

browser.tabs.executeScript({ file: "/scripts/spor-instantbul.js" }).then(initializePopup).catch(handleExecutionError);
