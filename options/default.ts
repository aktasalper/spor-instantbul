import type { WritableDeep } from "type-fest";

export const defaultPreferences = {
	anasayfa: {
		"hide-modal": false
	},
	satiskiralik: {
		"hide-warning": false
	}
};

export type PagePreferences = WritableDeep<typeof defaultPreferences>;
