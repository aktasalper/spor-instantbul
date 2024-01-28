export function getPage(url?: string) {
	const urlString = url ?? window.location.href;
	return urlString.split(".istanbul/")[1].split("/")[0];
}
