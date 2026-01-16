import Dexie, { type Table } from 'dexie';

// Generic form data interface - stores any form data as JSON
export interface FormData {
  id?: number;
  formId: string; // Unique identifier for each form instance
  data: Record<string, unknown>; // Generic form data stored as JSON
  updatedAt: number;
}

export class FormDatabase extends Dexie {
  formData!: Table<FormData, number>;

  constructor() {
    super('FormDatabase');
    this.version(1).stores({
      formData: '++id, formId, updatedAt',
    });
  }
}

export const db = new FormDatabase();
