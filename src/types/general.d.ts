import { UseFormReturn, FieldValues } from "react-hook-form";
import { FormEvent } from "react";

export type FormState = {
  errors?: { _form?: string[] };
  status?: string;
};

export type Preview = {
  file: File;
  displayUrl: string;
};

// ✅ `Submit` sekarang cocok dengan react-hook-form submit handler
export type Submit = (e?: FormEvent<HTMLFormElement>) => void;

export type FormReturn<T extends FieldValues = any> = UseFormReturn<T>;
