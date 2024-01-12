/** @typedef {"loading" | "complete"} TabStatus */

/** @type {ExtensionStorage} */
const storage = browser.storage.local;
/** @type {Array<HTMLButtonElement>} */
const actionButtons = [];
let countdownTimeout;

browser.runtime.onMessage.addListener((/** @type {TabStatus} message */ message) => {
	if (["loading", "complete"].includes(message)) {
		if (message === "loading") {
			actionButtons.forEach((button) => button.setAttribute("disabled", true));
		} else if (message === "complete") {
			actionButtons.forEach((button) => button.removeAttribute("disabled"));
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

async function getActiveTabs() {
	return browser.tabs.query({ active: true, currentWindow: true });
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
		const tabs = await getActiveTabs();
		const currentTab = tabs[0].id;

		updateCountdown();

		const optionsButton = document.getElementById("options");
		optionsButton.addEventListener("click", () => browser.runtime.openOptionsPage());

		const result = await storage.get("preferences");

		if (result != null && Object.keys(result).length > 0) {
			const { preferences } = result;
			const automationContainer = document.getElementsByClassName("automation")[0];
			automationContainer.classList.remove("hidden");

			/** @type {Preference} */
			const keys = Object.keys(preferences);

			for (const category of keys) {
				const textElement = document.getElementById(`preferred-${category}`);
				const container = textElement.parentElement;
				textElement.textContent = preferences[category].name;

				const button = document.createElement("button");
				button.textContent = "Seç";
				button.type = "button";
				button.addEventListener("click", () => {
					dispatch(currentTab, { action: `SELECT_${category.toUpperCase()}`, payload: preferences[category].value });
				});
				container.appendChild(button);
				actionButtons.push(button);
			}
		}
	} catch (error) {
		logError(error);
	}
}

initializePopup();
