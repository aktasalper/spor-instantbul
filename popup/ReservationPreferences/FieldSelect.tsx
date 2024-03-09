import { useStorage } from "@plasmohq/storage/hook";
import options from "./options.json";
import { storageKey } from "~constant";

export function FieldSelect({ disabled = false, value, handleChange }: ReservationPreferenceSelectProps) {
	const [preferences] = useStorage<ReservationPreferences>(storageKey.preferences, {} as any);
	const facilityFields: Array<ListOption> = options.field?.[preferences?.facility?.value] ?? [];

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
