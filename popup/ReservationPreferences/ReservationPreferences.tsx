import { useStorage } from "@plasmohq/storage/hook";

import { BranchSelect } from "./BranchSelect";
import { FacilitySelect } from "~components/FacilitySelect";
import { FieldSelect } from "./FieldSelect";

import { initialReservationPreferences, storageKey } from "~constant";
import { Table } from "~components/Table";

export function ReservationPreferences() {
	const [preferenceState, setPreferenceState] = useStorage<ReservationPreferences>(
		storageKey.preferences,
		(v) => v ?? initialReservationPreferences
	);

	return (
		<Table>
			<tbody>
				<tr>
					<Table.Th>
						<h5>Branş</h5>
					</Table.Th>
					<Table.Td>
						<BranchSelect value={preferenceState.branch.value} handleChange={() => undefined} />
					</Table.Td>
				</tr>
				<tr>
					<Table.Th>
						<h5>Salon</h5>
					</Table.Th>
					<Table.Td>
						<FacilitySelect
							branch={preferenceState.branch.value}
							value={preferenceState.facility.value}
							handleChange={(facility) => {
								setPreferenceState((prev) => ({
									...prev,
									facility
								}));
							}}
						/>
					</Table.Td>
				</tr>
				<tr>
					<Table.Th>
						<h5>Tesis</h5>
					</Table.Th>
					<Table.Td>
						<FieldSelect
							value={preferenceState.field.value}
							handleChange={(field) => {
								setPreferenceState((prev) => ({
									...prev,
									field
								}));
							}}
						/>
					</Table.Td>
				</tr>
			</tbody>
		</Table>
	);
}
