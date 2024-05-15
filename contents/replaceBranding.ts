import type { PlasmoCSConfig } from "plasmo";

import Branding from "url:../assets/branding.png";
import Logo from "url:../assets/icon.png";

const favicons: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link[rel='shortcut icon']");
if (!favicons.length) {
	const favicon = document.createElement("link");
	favicon.rel = "icon";
	favicon.href = Logo;
	document.head.appendChild(favicon);
} else {
	favicons.forEach((favicon) => (favicon.href = Logo));
}

const brandLink = document.getElementsByClassName("brand-logo")[0] as HTMLAnchorElement;
const brandImage = brandLink.getElementsByTagName("img")[0] as HTMLImageElement;
brandImage.src = Branding;

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/*"]
};
