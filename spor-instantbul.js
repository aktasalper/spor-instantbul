console.info("Add-on loaded!");
let favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}

favicon.href = "https://i.imgur.com/fRMQekW.png";

const branding = document.getElementsByClassName("logo-default")[0];
branding.src = "https://i.imgur.com/rVruxf8.png";
