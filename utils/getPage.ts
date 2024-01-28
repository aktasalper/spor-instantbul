export function getPage() {
	return window.location.href.split(".istanbul/")[1].split("/")[0];
}
