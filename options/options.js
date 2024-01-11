const initalPreferences = {
	branch: { name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" },
	facility: {
		name: "AVCILAR SPOR KOMPLEKSİ",
		value: "5d4ef42f-e103-431e-94cb-ad5aa5201850"
	},
	field: {
		name: "KAPALI TENİS KORTU 2",
		value: "39ab31e0-78ec-41ab-b866-c4040b357bd4"
	}
};
Object.freeze(initalPreferences);

class SporInstantbulStorage {
	#key = "preferences";
	#preferences = structuredClone(initalPreferences);

	constructor() {
		const preferences = localStorage.getItem(this.#key);
		if (!preferences) {
			localStorage.setItem(this.#key, JSON.stringify(this.#preferences));
		} else {
			this.#preferences = JSON.parse(preferences);
		}
	}

	#updateStorage() {
		localStorage.setItem(this.#key, JSON.stringify(this.#preferences));
	}

	/**
	 * @param {Preference} key
	 * @param {string} value
	 */
	setPreference(key, value) {
		this.#preferences[key] = value;
		this.#updateStorage();
	}

	get preferences() {
		return this.#preferences;
	}

	resetPreferences() {
		this.#preferences = structuredClone(initalPreferences);
		this.#updateStorage();
	}
}

/** @type {Set<string>} */
const listenedSelects = new Set();

function hydrateSelectsFromStorage() {
	/** @type {Array<Preference>} */
	const keys = Object.keys(select);

	for (const category of keys) {
		/** @type {HTMLSelectElement} */
		const element = select[category];
		element.value = storage.preferences[category].value;

		if (!listenedSelects.has(element.id)) {
			listenedSelects.add(element.id);
			element.addEventListener("change", (e) => {
				const select = e.target;
				const selectedOption = select.options[select.selectedIndex].text;

				storage.setPreference(category, { name: selectedOption, value: select.value });
			});
		}
	}
}

const storage = new SporInstantbulStorage();

const select = {
	branch: document.getElementById("branch"),
	facility: document.getElementById("facility"),
	field: document.getElementById("field")
};

// Update select values if localStorage preferences exist
if (storage.preferences) {
	hydrateSelectsFromStorage();
}

document.getElementById("reset").addEventListener("click", () => {
	storage.resetPreferences();
	hydrateSelectsFromStorage();
});
