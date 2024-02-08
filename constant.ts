import type { StringKeyOf } from "type-fest";

export const storageKey = {
	automation: "automation",
	preferences: "preferences",
	pagePreferences: "page-preference",
	sessionResPreference: "session_reservation-preference",
	satiskiralik: "satiskiralik"
};

export type StorageKey = StringKeyOf<typeof storageKey>;

export const avcilarFacility = "5d4ef42f-e103-431e-94cb-ad5aa5201850";

export const initialReservationPreferences = {
	branch: { name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" },
	facility: {
		name: "AVCILAR SPOR KOMPLEKSİ",
		value: avcilarFacility
	},
	field: {
		name: "AÇIK TENİS KORTU",
		value: "f2cadde6-efe1-4a44-99d2-c26222a16231"
	}
};

export const initialSatiskiralikPreferences: SatisKiralikPreferences = {
	automationStartStep: "branch"
};

export const automationDefault: AutomationState = { satiskiralik: null, uyeseanssecim: null };
export const automationPages: Set<AutomationPage> = new Set(["satiskiralik", "uyeseanssecim"]);
