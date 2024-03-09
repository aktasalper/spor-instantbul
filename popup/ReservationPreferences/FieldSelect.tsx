import { useStorage } from "@plasmohq/storage/hook";

import { storageKey } from "~constant";
import options from "~options.json";

export function FieldSelect({ disabled = false, value, handleChange }: ReservationPreferenceSelectProps) {
	const [preferences] = useStorage<ReservationPreferences>(storageKey.preferences, {} as any);

	const fieldScope = options[`field:${preferences?.branch?.value}`];
	const facilityFields: Array<ListOption> = fieldScope?.[preferences?.facility?.value] ?? [];

	return (
		<select
			disabled={disabled}
			value={value}
			onChange={(e) => handleChange(facilityFields.find((f) => f.value === e.target.value))}>
			{facilityFields.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.name}
				</option>
			))}
		</select>
	);
}
