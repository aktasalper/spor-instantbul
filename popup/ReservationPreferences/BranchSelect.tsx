export const BranchSelect = ({ value }: ReservationPreferenceSelectProps) => (
	<select value={value}>
		<option value='59b7bd71-1aab-4751-8248-7af4a7790f8c'>Tenis</option>
		<option hidden value='5bdbe5f0-a06e-4243-b65d-231b3c2247ed'>
			Futbol
		</option>
		<option hidden value='b735aa4b-5923-4789-a04e-bf3e0b0a467c'>
			Basketbol / Voleybol
		</option>
		<option hidden value='46f3a438-9535-4fea-b6a8-c8533041d7f9'>
			Stad Kiralama
		</option>
		<option hidden value='43765821-070d-4b2c-80d3-0193729d165e'>
			Tenis Çalışma Duvarı
		</option>
		<option hidden value='52f5e05c-9bf5-485f-8033-f914bc9e6097'>
			Masa Tenisi
		</option>
	</select>
);
