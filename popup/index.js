/** @typedef {"loading" | "complete"} TabStatus */

/** @type {ExtensionStorage} */
const storage = browser.storage.local;
/** @type {Array<HTMLButtonElement>} */
const actionButtons = [];
const automationKey = "automation";
const automateButton = document.getElementById("automate");
let countdownTimeout;

browser.runtime.onMessage.addListener((message) => {
	if (["loading", "complete"].includes(message)) {
		if (message === "loading") {
			actionButtons.forEach((button) => button.setAttribute("disabled", true));
		} else if (message === "complete") {
			getIsAutomationInProgress.then((bool) => {
				const buttonsToEnable = actionButtons.filter((b) => (bool ? b.id !== "automate" : b));
				buttonsToEnable.forEach((button) => button.removeAttribute("disabled"));
			});
		}
	}
});

/**
 * @param {string} tabID
 * @param {DispatchOption} options
 */
function dispatch(tab, options) {
	browser.tabs.sendMessage(tab, options);
}

/** @returns {Promise<Object | null>} */
async function getCurrentTab() {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });
	return tabs[0] ?? null;
}

async function getIsAutomationInProgress() {
	const result = await storage.get(automationKey);
	return result.automation != null;
}

/** @param {boolean} shouldBeEnabled */
function setAutomateButtonEnabled(shouldBeEnabled) {
	if (shouldBeEnabled) {
		automateButton.removeAttribute("disabled");
	} else {
		automateButton.setAttribute("disabled", true);
	}
}

function storageValueExists(result) {
	return result != null && Object.keys(result).length > 0;
}

/** @param {number} seconds Time remaining in *seconds* */
function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600);
	const remainingMinutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	let formattedTime = "";
	if (hours > 0) {
		formattedTime += String(hours).padStart(2, "0") + ":";
	}

	formattedTime += String(remainingMinutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");

	return formattedTime;
}

/** @returns {number} amount of *milliseconds* before the target hour */
function calculateTimeUntilNextReservationSlot() {
	const currentDate = new Date(),
		targetDate = new Date();

	const currentHour = currentDate.getHours();

	let targetHour;
	// Reservations can be made for times between 8AM - 10PM
	if (currentHour >= 8 && currentHour < 22) {
		targetHour = currentHour + 1;
	} else {
		targetDate.setHours(targetDate.getHours() + 24);
		targetHour = 8;
	}

	targetDate.setHours(targetHour);
	targetDate.setMinutes(0);
	targetDate.setSeconds(0);
	targetDate.setMilliseconds(0);
	const diff = targetDate - currentDate;

	return Math.max(diff, 0);
}

function updateCountdown() {
	const countdownElement = document.getElementById("countdown");

	const millisecondsUntilNextResSlot = calculateTimeUntilNextReservationSlot();
	const secondsUntilNextResSlot = Math.floor(millisecondsUntilNextResSlot / 1000);

	countdownElement.textContent = formatTime(secondsUntilNextResSlot);

	countdownTimeout = setTimeout(updateCountdown, 1000);
}

async function initializePopup() {
	console.info("::init popup");
	clearTimeout(countdownTimeout);
	try {
		const currentTab = await getCurrentTab();
		console.log("🚀 ~ initializePopup ~ currentTab:", currentTab);

		updateCountdown();

		const preferenceStorageData = await storage.get("preferences");

		if (storageValueExists(preferenceStorageData)) {
			const { preferences } = preferenceStorageData;
			const automationContainer = document.getElementsByClassName("column hidden")[0];
			automationContainer.classList.remove("hidden");

			const automateButton = document.getElementById("automate");
			const isAutomationInProgress = await getIsAutomationInProgress();
			const isInReservationPage = currentTab?.url?.endsWith("/satiskiralik");

			if (isAutomationInProgress || !isInReservationPage) {
				automateButton.setAttribute("disabled", true);
			}

			automateButton.addEventListener("click", () => {
				storage
					.set({ [automationKey]: "facility" })
					.then(() => dispatch(currentTab?.id, { action: "SELECT_BRANCH", payload: preferences.branch.value }));
			});
			actionButtons.push(automateButton);

			/** @type {Preference} */
			const keys = Object.keys(preferences);

			for (const category of keys) {
				const textElement = document.getElementById(`preferred-${category}`);
				textElement.textContent = preferences[category].name;
			}
		}

		const optionsButton = document.getElementById("options");
		optionsButton.addEventListener("click", () => browser.runtime.openOptionsPage());
	} catch (error) {
		console.error("Could not initiate pop-up view:", error);
	}
}

initializePopup();
