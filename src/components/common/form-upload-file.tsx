import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import Image from "next/image";
import { getImageData } from "@/lib/utils";

export default function FormUploadFile<T extends FieldValues>({
    form,
    name,
    label,
    preview,
    setPreview,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    preview?: {
            file: File;
            displayUrl: string;
    };
        setPreview?: (preview: { file: File; displayUrl: string; })=>void;
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