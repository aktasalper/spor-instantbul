const branches = [
	{ hidden: false, name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" },
	{ hidden: false, name: "Futbol", value: "5bdbe5f0-a06e-4243-b65d-231b3c2247ed" },
	{ hidden: false, name: "Basketbol / Voleybol", value: "b735aa4b-5923-4789-a04e-bf3e0b0a467c" },
	{ hidden: true, name: "Stad Kiralama", value: "46f3a438-9535-4fea-b6a8-c8533041d7f9" },
	{ hidden: true, name: "Tenis Çalışma Duvarı", value: "43765821-070d-4b2c-80d3-0193729d165e" },
	{ hidden: true, name: "Masa Tenisi", value: "52f5e05c-9bf5-485f-8033-f914bc9e6097" }
];

export const BranchSelect = ({ disabled = false, value, handleChange }: ReservationPreferenceSelectProps) => (
	<select
		disabled={disabled}
		value={value}
		onChange={(e) => handleChange(branches.find((b) => b.value === e.target.value))}>
		{branches.map((branch) => (
			<option key={branch.value} value={branch.value} hidden={branch.hidden}>
				{branch.name}
			</option>
		))}
	</select>
);
