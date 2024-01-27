import React from "react";

import options from "./options.json";
import { useStorage } from "@plasmohq/storage/hook";
import { storageKey } from "~constant";

export function FacilitySelect({ value, handleChange }: ReservationPreferenceSelectProps) {
	const [preferences] = useStorage<PreferenceObject>(storageKey.preferences, {} as any);
	const branchFacilities: Array<ReservationOption> = (options.facility?.[preferences?.branch?.value] ?? []).filter(
		(f) => !f.hidden
	);

	return (
		<>
			<select value={value} onChange={(e) => handleChange(branchFacilities.find((f) => f.value === e.target.value))}>
				{branchFacilities.map((facility) => (
					<option key={facility.value} value={facility.value}>
						{facility.name}
					</option>
				))}
			</select>
		</>
	);
}
