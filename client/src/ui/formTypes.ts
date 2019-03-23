export type TextFieldProps = {
  hintText?: string;
  floatingLabelText?: string | any;
  errorText?: string;
  type?: string;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  multiLine?: boolean;
  rows?: number;
} & SelectFieldProps;

export type SelectFieldProps = {
  autoWidth?: boolean;
  options?: Option[]
}

type Option = {
  value: string | number;
  primaryText: string
}
