import type { PlasmoCSConfig } from "plasmo";

import Branding from "url:../assets/branding.png";
import Logo from "url:../assets/icon.png";

let favicon: HTMLLinkElement = document.querySelector("link[rel~='icon']");
if (!favicon) {
	favicon = document.createElement("link");
	favicon.rel = "icon";
	document.head.appendChild(favicon);
}
favicon.href = Logo;

const branding = document.getElementsByClassName("logo-default")[0] as HTMLImageElement;
branding.src = Branding;

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/*"]
};
