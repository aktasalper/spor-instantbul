import type { PlasmoCSConfig } from "plasmo";

window.alert = () => console.warn("!!! ALERT OVERRIDEN");

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/*"],
	world: "MAIN"
};
