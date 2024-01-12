console.info("Add-on loaded!");
let favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}

favicon.href = browser.runtime.getURL("assets/logo.png");

const branding = document.getElementsByClassName("logo-default")[0];
branding.src = browser.runtime.getURL("assets/branding.png");
