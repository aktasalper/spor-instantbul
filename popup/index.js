let countdownTimeout;

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

/**
 * @param {string} tabID
 * @param {DispatchOption} options
 */
function dispatch(tab, options) {
	browser.tabs.sendMessage(tab, options);
}

async function initializePopup() {
	console.info("::init popup");
	clearTimeout(countdownTimeout);
	try {
		const tabs = await getActiveTabs();

		const currentTab = tabs[0].id;

		updateCountdown();

		const optionsButton = document.getElementsByTagName("button")[0];
		optionsButton.addEventListener("click", () => browser.runtime.openOptionsPage());

		/** @type {Record<Preference, string> | null} */
		const preferences = localStorage.getItem("preferences") ? JSON.parse(localStorage.getItem("preferences")) : null;

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
	console.error(`Failed to initialize pop-up script: ${error.message}`);
}

function logError(error) {
	console.error(`Could not execute "spor-instantbul.js": ${error}`);
}

browser.tabs.executeScript({ file: "/scripts/spor-instantbul.js" }).then(initializePopup).catch(handleExecutionError);
