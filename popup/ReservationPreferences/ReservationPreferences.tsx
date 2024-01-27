import { useStorage } from "@plasmohq/storage/hook";

import { BranchSelect } from "./BranchSelect";
import { FacilitySelect } from "./FacilitySelect";
import { FieldSelect } from "./FieldSelect";

import { initialReservationPreferences, storageKey } from "~constant";

export function ReservationPreferences() {
	const [preferenceState, setPreferenceState] = useStorage<PreferenceObject>(
		storageKey.preferences,
		(v) => v ?? initialReservationPreferences
	);

	return (
		<table>
			<tr>
				<th>
					<h5>Branş</h5>
				</th>
				<td>
					<BranchSelect value={preferenceState.branch.value} handleChange={() => undefined} />
				</td>
			</tr>
			<tr>
				<th>
					<h5>Salon</h5>
				</th>
				<td>
					<FacilitySelect
						value={preferenceState.facility.value}
						handleChange={(facility) => {
							setPreferenceState((prev) => ({
								...prev,
								facility
							}));
						}}
					/>
				</td>
			</tr>
			<tr>
				<th>
					<h5>Tesis</h5>
				</th>
				<td>
					<FieldSelect
						value={preferenceState.field.value}
						handleChange={(field) => {
							setPreferenceState((prev) => ({
								...prev,
								field
							}));
						}}
					/>
				</td>
			</tr>
		</table>
	);
}
