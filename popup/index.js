async function getActiveTabs() {
	return browser.tabs.query({ active: true, currentWindow: true });
}

function initializePopup() {
	getActiveTabs()
		.then((tabs) => {
			const select = document.getElementsByTagName("select")[0];

			select.addEventListener("change", (e) => {
				browser.tabs.sendMessage(tabs[0].id, { val: e.target.value });
			});
		})
		.catch(logError);
}

function handleExecutionError(error) {
	console.info("\t::handleExecutionError -", error);
	console.error(`Failed to initialize pop-up script: ${error.message}`);
}

function logError(error) {
	console.error(`Could not execute "spor-instantbul.js": ${error}`);
}

browser.tabs.executeScript({ file: "/scripts/spor-instantbul.js" }).then(initializePopup).catch(handleExecutionError);
