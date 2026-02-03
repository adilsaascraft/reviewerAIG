// stores/formStore.ts
"use client";
import { create } from "zustand";
import { nanoid } from "nanoid";

type Field = any;

interface FormState {
  formId: string | null;
  setFormId: (id: string | null) => void;

  formTitle: string;
  setFormTitle: (title: string) => void;

  fields: Field[];
  selectedId: string | null;

  lastAddedType: string | null;
  setLastAddedType: (type: string) => void;

  addField: (type: string) => void;
  setFields: (f: Field[]) => void;
  updateField: (id: string, patch: Partial<Field>) => void;
  removeField: (id: string) => void;
  selectField: (id: string) => void;

  loadForm: (title: string, fields: Field[], id?: string | null) => void;
  resetForm: () => void;
}

const useFormStore = create<FormState>((set, get) => ({
  formId: null,
  setFormId: (id: string | null) => set({ formId: id }),

  formTitle: "Untitled Form",
  setFormTitle: (title: string) => set({ formTitle: title }),

  fields: [],
  selectedId: null,

  lastAddedType: null,
  setLastAddedType: (type: string) => set({ lastAddedType: type }),

  addField(type) {
    const id = nanoid();

    const defaults: any = {
      id,
      type,
      label:
        type === "input"
          ? "Input"
          : type === "textarea"
          ? "Textarea"
          : type === "checkbox"
          ? "Checkbox"
          : type === "select"
          ? "Select"
          : "Field",

      placeholder:
        type === "input" || type === "textarea" ? "" : undefined,

      options:
        type === "select" || type === "radio"
          ? ["Option 1"]
          : type === "checkbox"
          ? []
          : undefined,

      value: type === "checkbox" ? [] : "",

      inputTypes: type === "input" ? "text" : undefined,
      fileUploadTypes: undefined,

      required: false,
      description: "",
      minLength: undefined,
      maxLength: undefined,
      defaultValue: "",

      minSelected: undefined,
      maxSelected: undefined,

      maxFileSize: undefined,
    };

    set({
      fields: [...get().fields, defaults],
      selectedId: id,
      lastAddedType: type,
    });
  },

  setFields(f) {
    set({ fields: f });
  },

  updateField(id, patch) {
    set({
      fields: get().fields.map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    });
  },

  removeField(id) {
    set({
      fields: get().fields.filter((f) => f.id !== id),
      selectedId: null,
    });
  },

  selectField(id) {
    set({ selectedId: id });
  },

  loadForm(title, fields, id = null) {
    set({
      formTitle: title || "Untitled Form",
      fields: fields || [],
      selectedId: (fields && fields.length > 0 && (fields[0].id || fields[0]._id)) || null,
      formId: id || null,
    });
  },

  resetForm() {
    set({
      formId: null,
      formTitle: "Untitled Form",
      fields: [],
      selectedId: null,
      lastAddedType: null,
    });
  },
}));

export default useFormStore;
