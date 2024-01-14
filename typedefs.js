/** @namespace typedefs - https://stackoverflow.com/a/55306135/16806945 */

// STORAGE
/** @typedef {Object} StorageResults */

/** @typedef {string | Array<string>} KeyQuery */

/**
 * @callback StorageGetCallback
 * @param {t.KeyQuery} keys
 * @returns {Promise<t.StorageResults | undefined>}
 */

/**
 * @callback StorageSetCallback
 * @param {Object} keys Key to update, along with its values, e.g.: `{preferences: {branch: "Tennis"}}`
 * @returns {Promise<void>}
 */

/**
 * @callback StorageRemoveCallback
 * @param {KeyQuery} keys
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} StorageOnChanged
 * @property {EventListener} addListener
 * @property {EventListener} removeListener
 * @property {() => boolean} hasListener
 */

/**
 * @typedef {Object} ExtensionStorage
 * @property {() => void} clear
 * @property {StorageGetCallback} get
 * @property {StorageSetCallback} set
 * @property {StorageRemoveCallback} remove
 * @property {() => Promise<void>} clear Removes **all** items from the storage area.
 * @property {StorageOnChanged} onChanged
 */

// >> STORAGE VARIABLES
/** @typedef {"branch" | "facility" | "field"} Preference */

/** @typedef {Record<Preference, {name: string, value: string}>} PreferenceObject */

/** @typedef {"reservation" | "to_cart"} ReservationProcess */
/** @typedef {Preference | ReservationProcess | null} AutomationState */

// OTHER
/** @typedef {"SELECT_BRANCH" | "SELECT_FACILITY" | "SELECT_FIELD" | "ADD_RESERVATION" | "ADD_TO_CART"} MessageAction */

/**
 * @typedef {Object} DispatchOption
 * @property {MessageAction} action
 * @property {string | undefined} payload
 */

exports.unused = {};
