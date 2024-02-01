import { resetAutomationState } from "./resetAutomationState";

export function changeSelectValue(selector: string, newValue: string) {
	const select = document.getElementById(selector) as HTMLSelectElement;
	const options = Array.from(select.children) as Array<HTMLOptionElement>;

	const userSelection = options.find((opt) => opt.value === newValue);

	if (userSelection != null) {
		select.value = newValue;
		select.dispatchEvent(new Event("change")); // spor.istanbul component listens for "change" event to move to the next step
	} else {
		resetAutomationState();
		alert(
			`${selector} için ${newValue} seçeneği bulunamadı! Sunulan seçeneklerin değerleri değişmiş olabilir. Otomasyon işlemi durduruldu. Eğer sorun devam ederse lütfen benimle iletişime geçin.`
		);
	}
}
