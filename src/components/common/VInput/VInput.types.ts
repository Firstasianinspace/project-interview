import { Ref } from "vue";

export interface IInputProps {
  wrapperClass?: string;
  decoratorClass?: string;
  size?: "m" | "l";
  label?: string;
  hasError?: boolean;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  clearable?: boolean;
  modelValue: string | number;
  disabled?: boolean;
}

export type IInputEmits = {
  "update:modelValue": [value: string];
  focus: [];
  blur: [];
  clear: [];
};

export interface IInputExpose {
  blur: () => void;
  focus: () => void;
  inputRef: Ref<HTMLInputElement | null>;
}
