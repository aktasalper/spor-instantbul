import { branches } from "~constant";

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
