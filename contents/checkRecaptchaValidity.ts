import type { PlasmoCSConfig } from "plasmo";

declare const grecaptcha: any;

let captchaTimeout: NodeJS.Timeout;
function validateCaptcha() {
	clearTimeout(captchaTimeout);

	captchaTimeout = setTimeout(() => {
		const response = grecaptcha.getResponse();

		if (response) {
			const captcha = document.getElementsByClassName("g-recaptcha")[0] as HTMLDivElement;
			captcha.style.boxShadow = "-2px 3px 16px 13px lime";
			captcha.style.outline = "none";
			const input = document.getElementById("spor-instantbul-recaptcha-valid") as HTMLInputElement;
			input.checked = true;
		} else {
			validateCaptcha();
		}
	}, 250);
}

let locateInputTimeout: NodeJS.Timeout;
let tries = 0;
function locateInput() {
	if (tries < 10) {
		tries += 1;
		clearTimeout(locateInputTimeout);

		locateInputTimeout = setTimeout(() => {
			const input = document.getElementById("spor-instantbul-recaptcha-valid");
			if (input) {
				validateCaptcha();
			} else {
				locateInput();
			}
		}, 250);
	}
}

locateInput();

export const config: PlasmoCSConfig = {
	matches: ["*://online.spor.istanbul/uyeseanssecim"],
	world: "MAIN"
};
