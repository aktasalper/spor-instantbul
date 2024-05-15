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
			`"${selector}" elementinin "${newValue}" seçeneği bulunamadığı için otomasyon işlemi durduruldu! Seçeneklerin tanımları değişmiş olabilir. Eğer sorun devam ederse, eklenti sayfasındaki mail adresinden benimle iletişime geçebilirsiniz.`
		);
	}
}
