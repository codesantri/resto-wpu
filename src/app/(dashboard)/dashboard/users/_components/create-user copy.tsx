import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ICREATE_USER, ISTATE_CREATE_USER, ROLE_LIST } from "@/constants/user-constans";
import { UserForm, userFormSchema } from "@/validations/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import createUser from "./actions";
import { DialogClose } from "@radix-ui/react-dialog";
import FormSelect from "@/components/common/form-select";
import FormUploadFile from "@/components/common/form-upload-file";

export default function CreateUser() {
        const form = useForm<UserForm>({
        resolver: zodResolver(userFormSchema),
        defaultValues:ICREATE_USER
    })

    const [createState, createAction, isPendingCreate] = useActionState(createUser, ISTATE_CREATE_USER);
    const [preview, setPreview] = useState <{file: File; displayUrl:string}| undefined >(undefined);

    const onSubmit = form.handleSubmit(async (data) => {
        // console.log(data);
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        startTransition(() => {
            createAction(formData);
        });
    });

    useEffect(() => {
        if (createState?.status === 'error') {
            toast.error('Failed', {
                description:createState.errors?._form?.[0],
            })
            startTransition(() => {
                createAction(null);
            })

        }
        // Notifkasi Letak di 

        if (createState?.status==='success') {
            toast.success('Data saved!.');
            form.reset();
            document.querySelector('[data-state="open"] [data-slot="dialog-close"]')?.click();
        }
    }, [createState]);
    return (
        <DialogContent>
            <Form {...form}>
                    <form className="space-y-5" onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            Create New User
                        </DialogTitle>
                    </DialogHeader>
                        <FormInput form={form} type="email" label="Email" name="email" ph="Enter email"  />
                        <FormInput form={form} label="Name" name="name" ph="Enter name"  />
                    <FormSelect form={form} label="Role" items={ROLE_LIST} name="role" />
                    <FormUploadFile  form={form} label="Avatar" preview={preview} setPreview={setPreview} name="avatar_url"/>
                        <FormInput form={form} type="password" label="Password" name="password" ph="*********"  />
                    <DialogFooter>
                        <div className="flex space-x-2">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => form.reset()} type="button" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">
                                {isPendingCreate ? <Loader2 className="animate-spin"/> :'Create'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
                </Form>
        </DialogContent>
    )
}