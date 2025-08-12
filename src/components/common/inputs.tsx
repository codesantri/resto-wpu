import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { cn, getImageData } from "@/lib/utils";
import { Preview } from "@/types/general";
import Image from "next/image";

export  function TextInput<T extends FieldValues>({
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

export function SelectInput<T extends FieldValues>({
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

export function FileUpload<T extends FieldValues>({
    form,
    name,
    label,
    preview,
    setPreview,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    preview?:Preview;
        setPreview?: (preview: Preview)=>void;
    }) {
    return (
        <FormField control={form.control} name={name} render={({field: {onChange, ...rest}}) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-2">
                        {preview?.displayUrl ? (
                            <Image src={preview?.displayUrl} width={100} height={100} alt="preview" className="w-9 aspect-square bg-accent rounded-lg"/>
                        ) : (
                             <div className="w-10 aspect-square bg-accent rounded-lg flex items-center justify-center"></div>   
                            )}
                            <Input
                        name={rest.name}
                        ref={rest.ref}
                        onBlur={rest.onBlur}
                        type="file"
                        disabled={rest.disabled}
                        onChange={async (event) => {
                            onChange(event);
                            const { file, displayUrl } = getImageData(event);
                            if (file) {
                                setPreview?.({
                                    file,
                                    displayUrl,
                                })
                            }
                        }}
                    />  
                    </div>
                </FormControl>
                <FormMessage className="text-xs"/>
            </FormItem>
        )} />
    )
}