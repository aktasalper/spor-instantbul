import type { StringKeyOf } from "type-fest";

import options from "~options.json";

export const storageKey = {
	automation: "automation",
	preferences: "preferences",
	pagePreferences: "page-preference",
	sessionResPreference: "session_reservation-preference",
	satiskiralik: "satiskiralik"
};

export type StorageKey = StringKeyOf<typeof storageKey>;

export const branches = [
	{ hidden: false, name: "Tenis", value: "59b7bd71-1aab-4751-8248-7af4a7790f8c" },
	{ hidden: false, name: "Futbol", value: "5bdbe5f0-a06e-4243-b65d-231b3c2247ed" },
	{ hidden: false, name: "Basketbol / Voleybol", value: "b735aa4b-5923-4789-a04e-bf3e0b0a467c" },
	{ hidden: true, name: "Stad Kiralama", value: "46f3a438-9535-4fea-b6a8-c8533041d7f9" },
	{ hidden: true, name: "Tenis Çalışma Duvarı", value: "43765821-070d-4b2c-80d3-0193729d165e" },
	{ hidden: true, name: "Masa Tenisi", value: "52f5e05c-9bf5-485f-8033-f914bc9e6097" }
] as const;

const tennis = branches[0];
export const avcilarFacility: ListOption = options.facility[tennis.value][0];
const avcilarFacilityField = options.field[avcilarFacility.value][0];

export const initialReservationPreferences = {
	branch: tennis,
	facility: avcilarFacility,
	field: avcilarFacilityField
};

export const initialSatiskiralikPreferences: SatisKiralikPreferences = {
	automationStartStep: "branch"
};

export const automationDefault: AutomationState = { satiskiralik: null, uyeseanssecim: null };
export const automationPages: Set<AutomationPage> = new Set(["satiskiralik", "uyeseanssecim"]);

export type BranchType = (typeof branches)[number]["name"];
export type ProjectOptionsType = typeof options;
