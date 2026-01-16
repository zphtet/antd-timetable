import Dexie from 'dexie';

/**
 * Generic form data structure - stores any form data as JSON
 * @typedef {Object} FormData
 * @property {number} [id] - Auto-incrementing ID
 * @property {string} formId - Unique identifier for each form instance
 * @property {Object<string, *>} data - Generic form data stored as JSON
 * @property {number} updatedAt - Timestamp of last update
 */

export class FormDatabase extends Dexie {
  formData;

  constructor() {
    super('FormDatabase');
    this.version(1).stores({
      formData: '++id, formId, updatedAt',
    });
  }
}

export const db = new FormDatabase();