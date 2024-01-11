async function getActiveTabs() {
	return browser.tabs.query({ active: true, currentWindow: true });
}

/**
 * @param {string} tabID
 * @param {DispatchOption} options
 */
function dispatch(tab, options) {
	browser.tabs.sendMessage(tab, options);
}

async function initializePopup() {
	console.info("::init popup");
	try {
		const tabs = await getActiveTabs();

		const currentTab = tabs[0].id;

		const optionsButton = document.getElementsByTagName("button")[0];
		optionsButton.addEventListener("click", () => browser.runtime.openOptionsPage());

		/** @type {Record<Preference, string> | null} */
		const preferences = localStorage.getItem("preferences") ? JSON.parse(localStorage.getItem("preferences")) : null;
		console.log("\tpreferences", { preferences });

		if (preferences) {
			const container = document.getElementsByClassName("preferences")[0];
			container.classList.remove("hidden");

			/** @type {Preference} */
			const keys = Object.keys(preferences);

			for (const category of keys) {
				const textElement = document.getElementById(`preferred-${category}`);
				textElement.innerText = preferences[category].name;

				const button = document.createElement("button");
				button.innerText = category.toUpperCase() + " Seç";
				button.type = "button";
				button.addEventListener("click", () => {
					dispatch(currentTab, { action: `SELECT_${category.toUpperCase()}`, payload: preferences[category].value });
				});
				container.appendChild(button);
			}
		}
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
