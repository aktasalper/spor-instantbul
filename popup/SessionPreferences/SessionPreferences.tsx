import { useStorage } from "@plasmohq/storage/hook";
import { FacilitySelect } from "~components/FacilitySelect";
import { avcilarFacility as defaultFacility, storageKey } from "~constant";

export function SessionPreferences() {
	const [branchPreference] = useStorage<ReservationPreferences>(storageKey.preferences);
	const [sessionFacilityPreference, setFacilityPreference] = useStorage<string>(
		storageKey.sessionResPreference,
		(v) => v ?? defaultFacility.value
	);

	if (!sessionFacilityPreference || Object.keys(sessionFacilityPreference).length === 0) {
		return null;
	}

	return (
		<FacilitySelect
			showHidden
			branch={branchPreference?.branch?.value}
			value={sessionFacilityPreference}
			handleChange={(opt) => setFacilityPreference(opt.value)}
		/>
	);
}
