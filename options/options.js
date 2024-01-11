console.group("OPTIONS");

class SporInstantbulStorage {
	#key = "preferences";
	#preferences = {
		branch: { name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" }
	};

	constructor() {
		console.info("::constructor - key exists:", !!localStorage.getItem(this.#key), localStorage.getItem(this.#key));
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
	 * @param {"branch"} key
	 * @param {string} value
	 */
	setPreference(key, value) {
		this.#preferences[key] = value;
		this.#updateStorage();
	}

	get preferences() {
		return this.#preferences;
	}
}

const storage = new SporInstantbulStorage();

const branchSelect = document.getElementsByTagName("select")[0];

console.log("checking if storage has prefereces:", storage.preferences);
if (storage.preferences.branch) {
	console.log("current select value:", branchSelect.value);
	console.log("setting select value:", branchSelect, "to:", storage.preferences.branch);
	branchSelect.value = storage.preferences.branch.value;
}

branchSelect.addEventListener("change", (e) => {
	const select = e.target;
	const selectedOption = select.options[select.selectedIndex].text;

	const span = document.getElementById("selected-branch");
	span.innerText = select.value;

	console.log(selectedOption);

	console.log("prev preferences:", storage.preferences?.branch);

	storage.setPreference("branch", { name: selectedOption, value: select.value });
	console.log("new preferences:", storage.preferences?.branch);
});
console.groupEnd();
