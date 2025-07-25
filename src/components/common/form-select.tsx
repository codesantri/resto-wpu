import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";


export default function FormSelect<T extends FieldValues>({
    form,
    name,
    label,
    ph,
    items
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    ph?: string;
    items?: {value:string, label:string, disabled?:boolean}[];
    }) {
    return (
        <FormField control={form.control} name={name} render={({field: {onChange,...rest}}) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Select {...rest} onValueChange={onChange}>
                        <SelectTrigger className={cn('w-full', { 'border-red-500': form.formState.errors[name]?.message, })}>
                            <SelectValue placeholder={`Select ${label}`}></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{label}</SelectLabel>
                                {items?.map((item) => (
                                    <SelectItem key={item.label} value={item.value} disabled={item.disabled} className="capitalize">
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage className="text-xs"/>
            </FormItem>
        )} />
    )
}