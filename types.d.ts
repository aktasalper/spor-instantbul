type Preference = "branch" | "facility" | "field";
type ReservationProcess = "reservation" | "to_cart";

type MessageAction = `SELECT_${Uppercase<Preference>}` | `ADD_${Uppercase<ReservationProcess>}`;

type AutomationState = Preference | ReservationProcess | null;
type PreferenceObject = Record<Preference, { name: string; value: string }>;

type DispatchOption = { action: MessageAction; payload?: string };
