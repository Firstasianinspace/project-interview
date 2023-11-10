export type IInputChangeParams = {
  value: string;
  valid: boolean;
};

export type IInputPhoneEmits = {
  change: [params: IInputChangeParams];
};

export interface IInputPhoneProps {
  value?: string;
}

export interface IInputPhoneExpose {
  focus: () => void;
}
