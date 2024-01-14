const require = () => {};
const t = require("../typedefs");

/** @type {t.ExtensionStorage} */
const storageLocal = browser.storage.local;
const initalPreferences = {
	branch: { name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" },
	facility: {
		name: "AVCILAR SPOR KOMPLEKSİ",
		value: "5d4ef42f-e103-431e-94cb-ad5aa5201850"
	},
	field: {
		name: "AÇIK TENİS KORTU",
		value: "f2cadde6-efe1-4a44-99d2-c26222a16231"
	}
};
Object.freeze(initalPreferences);

/** @type {Set<string>} */
const listenedSelects = new Set();
const select = {
	branch: document.getElementById("branch"),
	facility: document.getElementById("facility"),
	field: document.getElementById("field")
};

class SporInstantbulStorage {
	#key = "preferences";
	/** @type {t.PreferenceObject} */
	#preferences = structuredClone(initalPreferences);

	constructor() {
		storageLocal
			.get(this.#key)
			.then((result) => {
				const isEmptyObj = typeof result === "object" && Object.keys(result).length === 0;
				if (result == null || isEmptyObj) {
					storageLocal.set({ [this.#key]: this.#preferences });
				} else {
					this.#preferences = { ...result.preferences };
					hydrateSelectsFromStorage();
				}
			})
			.catch((reason) => console.error(`Could not retrieve "${this.#key}":`, reason));
	}

	#updateStorage() {
		storageLocal
			.set({ [this.#key]: this.#preferences })
			.then()
			.catch((reason) => console.error(`Could not set "${this.#key}":`, reason));
	}

	/**
	 * @param {t.Preference} key
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
const storage = new SporInstantbulStorage();

function hydrateSelectsFromStorage() {
	/** @type {Array<t.Preference>} */
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

// Update select values if storageLocal preferences exist
if (storage.preferences) {
	hydrateSelectsFromStorage();
}

document.getElementById("reset").addEventListener("click", () => {
	storage.resetPreferences();
	hydrateSelectsFromStorage();
});
