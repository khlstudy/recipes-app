import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  name: string;
  label: string;
  caption?: string;
  error?: string;
}
