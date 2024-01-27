type ReservationOption = { name: string; value: string; hidden?: boolean };

interface ReservationPreferenceSelectProps {
	value: string;
	handleChange: (value: ReservationOption) => void;
}
