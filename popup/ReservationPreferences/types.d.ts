type ReservationOption = { name: string; value: string; hidden?: boolean };

interface ReservationPreferenceSelectProps {
	disabled?: boolean;
	value: string;
	handleChange: (value: ReservationOption) => void;
}
