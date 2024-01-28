type Preference = "branch" | "facility" | "field";
type ReservationProcess = "reservation" | "to_cart";
type ReservationPreferences = Record<Preference, { name: string; value: string }>;

type SessionPreference = string;
type SessionReservationProcess = "check" | "confirm" | "captcha" | "save";

type MessageAction =
	| `SELECT_${Uppercase<Preference | SessionReservationProcess>}`
	| `ADD_${Uppercase<ReservationProcess>}`;

type SatisKiralikAutomationState = Preference | ReservationProcess | null;
type SeansSecimAutomationState = "facility" | SessionReservationProcess;
type AutomationState = { satiskiralik: SatisKiralikAutomationState; uyeseanssecim: SeansSecimAutomationState };

type AutomationPage = "satiskiralik" | "uyeseanssecim";

type DispatchOption = { action: MessageAction; payload?: string };
