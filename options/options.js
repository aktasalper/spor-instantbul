/**
 * @typedef {Object} StorageResults
 */

/** @typedef {string | Array<string>} KeyQuery */

/**
 * @callback StorageGetCallback
 * @param {KeyQuery} keys
 * @returns {Promise<StorageResults | undefined>}
 */

/**
 * @callback StorageSetCallback
 * @param {Object} keys Key to update, along with its values, e.g.: `{preferences: {branch: "Tennis"}}`
 * @returns {Promise<void>}
 */

/**
 * @callback StorageRemoveCallback
 * @param {KeyQuery} keys
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} StorageOnChanged
 * @property {EventListener} addListener
 * @property {EventListener} removeListener
 * @property {() => boolean} hasListener
 */

/**
 * @typedef {Object} ExtensionStorage
 * @property {() => void} clear
 * @property {StorageGetCallback} get
 * @property {StorageSetCallback} set
 * @property {StorageRemoveCallback} remove
 * @property {() => Promise<void>} clear Removes **all** items from the storage area.
 * @property {StorageOnChanged} onChanged
 */

/** @type {ExtensionStorage} */
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

class SporInstantbulStorage {
	#key = "preferences";
	/** @type {typeof initalPreferences} */
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

// Update select values if storageLocal preferences exist
if (storage.preferences) {
	hydrateSelectsFromStorage();
}

document.getElementById("reset").addEventListener("click", () => {
	storage.resetPreferences();
	hydrateSelectsFromStorage();
});
