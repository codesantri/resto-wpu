import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export default function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    ph,
    type = "text"
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    ph?: string;
    type?: string;
    }) {
    return (
        <FormField control={form.control} name={name} render={({field: {...rest}}) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    {type === "textarea" ? (
                        <Textarea placeholder={ph} autoComplete="off" className="resize-none" />
                    ) : (
                        <Input {...rest} type={type} placeholder={ph} />    
                    )}
                </FormControl>
                <FormMessage className="text-xs"/>
            </FormItem>
        )} />
    )
}