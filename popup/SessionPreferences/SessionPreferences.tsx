import { useStorage } from "@plasmohq/storage/hook";
import { FacilitySelect } from "~components/FacilitySelect";
import { avcilarFacility, storageKey } from "~constant";

export function SessionPreferences() {
	const [branchPreference] = useStorage<ReservationPreferences>(storageKey.preferences);
	const [sessionFacilityPreference, setFacilityPreference] = useStorage<string>(
		storageKey.sessionResPreference,
		(v) => v ?? avcilarFacility
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
