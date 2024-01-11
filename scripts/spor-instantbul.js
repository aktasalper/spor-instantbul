(() => {
	if (window.hasRun) {
		return;
	}

	console.info("::content_script initialized");
	window.hasRun = true;

	browser.runtime.onMessage.addListener((/** @param {String} message */ message) => {
		console.log("received message:", message);
	});
})();
