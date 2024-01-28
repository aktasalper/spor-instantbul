import type { StorageKey } from "~constant";

import { useStorage } from "@plasmohq/storage/hook";

import options from "../popup/ReservationPreferences/options.json";

interface FacilitySelectProps extends ReservationPreferenceSelectProps {
	branch: string;
	showHidden?: boolean;
}

export function FacilitySelect({ value, handleChange, branch, showHidden }: FacilitySelectProps) {
	const branchFacilities: Array<ReservationOption> = (options.facility?.[branch] ?? []).filter((f) =>
		showHidden ? f : !f.hidden
	);

	return (
		<select value={value} onChange={(e) => handleChange(branchFacilities.find((f) => f.value === e.target.value))}>
			{branchFacilities.map((facility) => (
				<option key={facility.value} value={facility.value}>
					{facility.name}
				</option>
			))}
		</select>
	);
}
