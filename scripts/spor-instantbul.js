(() => {
	if (window.hasRun) {
		return;
	}

	class Storage {
		#key = "preferences";
		#preferences = {
			branch: "select2-ddlBransFiltre-result-gmyu-59b7bd71-1aab-4751-8248-7af4a7790f8c"
		};

		constructor() {
			console.info("::constructor");
			if (!localStorage.getItem(this.#key)) {
				localStorage.setItem(this.#key, JSON.stringify(this.#preferences));
			}
		}

		#updateStorage() {
			localStorage.setItem(this.#key, this.#preferences);
		}

		/**
		 * @param {string} key
		 * @param {string} value
		 */
		setPreference(key, value) {
			this.#preferences[key] = value;
			this.#updateStorage();
		}
	}

	console.info("::content_script initialized");
	window.hasRun = true;
	const sporInstantbulStorage = new Storage();

	browser.runtime.onMessage.addListener((/** @param {String} message */ message) => {
		console.log("received message:", message);
	});
})();
