import FormInput from "@/components/common/form-input";
import { ICREATE_USER, ISTATE_CREATE_USER, ROLE_LIST } from "@/constants/user-constans";
import { UserForm, userFormSchema } from "@/validations/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import createUser from "./actions";
import FormSelect from "@/components/common/form-select";
import FormUploadFile from "@/components/common/form-upload-file";
import ModalCreate from "@/components/common/modal-create";
import { toast } from "sonner";

export default function CreateUser() {
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: ICREATE_USER,
  });

  const [createState, createAction, isPendingCreate] = useActionState(
    createUser,
    ISTATE_CREATE_USER
  );

  const [preview, setPreview] = useState<{ file: File; displayUrl: string } | undefined>(undefined);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key==='avatar_url' ? preview!.file ?? '': value);
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
        if (createState?.status==='success') {
            toast.success('Data saved!.');
            form.reset();
            setPreview(undefined);
            (document.querySelector('[data-state="open"] [data-slot="dialog-close"]') as HTMLElement)?.click();
        }
    }, [createState]);

  return (
    <ModalCreate
      title="Create New User"
      form={form}
      submit={onSubmit}
      isPending={isPendingCreate}
    >
      <FormInput form={form} type="email" label="Email" name="email" ph="Enter email" />
      <FormInput form={form} label="Name" name="name" ph="Enter name" />
      <FormSelect form={form} label="Role" items={ROLE_LIST} name="role" />
      <FormUploadFile
        form={form}
        label="Avatar"
        preview={preview}
        setPreview={setPreview}
        name="avatar_url"
      />
      <FormInput form={form} type="password" label="Password" name="password" ph="********" />
    </ModalCreate>
  );
}
