export function getPostBackFnString(el: HTMLAnchorElement) {
	return el.href.replace("javascript:", "");
}
