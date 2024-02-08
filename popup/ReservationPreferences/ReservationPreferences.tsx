import { useStorage } from "@plasmohq/storage/hook";

import { BranchSelect } from "./BranchSelect";
import { FacilitySelect } from "~components/FacilitySelect";
import { FieldSelect } from "./FieldSelect";
import { Table } from "~components/Table";

import { initialReservationPreferences, initialSatiskiralikPreferences, storageKey } from "~constant";

import options from "./options.json";
import { Checkbox } from "~components/Checkbox";
import { Row } from "~components/Flex";

export function ReservationPreferences() {
	const [preferenceState, setPreferenceState] = useStorage<ReservationPreferences>(
		storageKey.preferences,
		(v) => v ?? initialReservationPreferences
	);
	const [satiskiralikPrefs, setSatiskiralikPrefs] = useStorage<SatisKiralikPreferences>(
		storageKey.satiskiralik,
		(v) => v ?? initialSatiskiralikPreferences
	);

	return (
		<Table>
			<tbody>
				<tr className={satiskiralikPrefs.automationStartStep !== "branch" ? "opacity-50" : ""}>
					<Table.Th>
						<Row title='Otomasyon başlangıç adımı olarak seç'>
							<input
								id='branchRadio'
								type='radio'
								name='startState'
								value='branch'
								checked={satiskiralikPrefs.automationStartStep === "branch"}
								onChange={(e) =>
									setSatiskiralikPrefs((prev) => ({ ...prev, automationStartStep: e.target.value as Preference }))
								}
								className='w-max'
							/>

							<label htmlFor='branchRadio' className='text-white'>
								<h5>Branş</h5>
							</label>
						</Row>
					</Table.Th>
					<Table.Td>
						<BranchSelect
							disabled={satiskiralikPrefs.automationStartStep !== "branch"}
							value={preferenceState.branch.value}
							handleChange={() => undefined}
						/>
					</Table.Td>
				</tr>
				<tr className={satiskiralikPrefs.automationStartStep === "field" ? "opacity-50" : ""}>
					<Table.Th>
						<Row title='Otomasyon başlangıç adımı olarak seç'>
							<input
								id='facilityRadio'
								type='radio'
								name='startState'
								value='facility'
								checked={satiskiralikPrefs.automationStartStep === "facility"}
								onChange={(e) =>
									setSatiskiralikPrefs((prev) => ({ ...prev, automationStartStep: e.target.value as Preference }))
								}
								className='w-max'
							/>

							<label htmlFor='facilityRadio' className='text-white'>
								<h5>Tesis</h5>
							</label>
						</Row>
					</Table.Th>
					<Table.Td>
						<FacilitySelect
							disabled={satiskiralikPrefs.automationStartStep === "field"}
							branch={preferenceState.branch.value}
							value={preferenceState.facility.value}
							handleChange={(facility) => {
								setPreferenceState((prev) => ({
									...prev,
									facility,
									field: options.field[facility.value][0]
								}));
							}}
						/>
					</Table.Td>
				</tr>
				<tr>
					<Table.Th>
						<Row title='Otomasyon başlangıç adımı olarak seç'>
							<input
								id='fieldRadio'
								type='radio'
								name='startState'
								value='field'
								checked={satiskiralikPrefs.automationStartStep === "field"}
								onChange={(e) =>
									setSatiskiralikPrefs((prev) => ({ ...prev, automationStartStep: e.target.value as Preference }))
								}
								className='w-max'
							/>

							<label htmlFor='fieldRadio' className='text-white'>
								<h5>Salon</h5>
							</label>
						</Row>
					</Table.Th>
					<Table.Td>
						<FieldSelect
							disabled={false}
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
