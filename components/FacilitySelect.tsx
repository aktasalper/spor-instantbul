import options from "~options.json";

interface FacilitySelectProps extends ReservationPreferenceSelectProps {
	branch: string;
	showHidden?: boolean;
}

export function FacilitySelect({ disabled = false, value, handleChange, branch, showHidden }: FacilitySelectProps) {
	const branchFacilities: Array<ListOption> = (options.facility?.[branch] ?? []).filter((f) =>
		showHidden ? f : !f.hidden
	);

	return (
		<select
			disabled={disabled}
			value={value}
			onChange={(e) => handleChange(branchFacilities.find((f) => f.value === e.target.value))}>
			{branchFacilities.map((facility) => (
				<option key={facility.value} value={facility.value}>
					{facility.name}
				</option>
			))}
		</select>
	);
}
