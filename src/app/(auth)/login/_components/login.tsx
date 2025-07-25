'use client';

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { INITIAL_LOGIN_FORM, INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { LoginForm, loginFormSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AppLogo from "@/components/common/app-logo";

export default function Login() {
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginFormSchema),
        defaultValues:INITIAL_LOGIN_FORM
    })

    const [loginState, loginAction, isPendingLogin]=useActionState(login, INITIAL_STATE_LOGIN_FORM)

    const onSubmit = form.handleSubmit(async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        startTransition(() => {
            loginAction(formData);
        });
    });

    useEffect(() => {
        if (loginState?.status === 'error') {
            toast.error('Login failed', {
                description:loginState.errors?._form?.[0],
            })
            startTransition(() => {
                loginAction(null);
            })

        }
    }, [loginState]);
    return (
        <Card>
            <CardHeader className="text-center flex flex-col items-center">
                <AppLogo/>
                <CardTitle className="text-xl mt-3">Welcome!</CardTitle>
                <CardDescription>Please sign in for go to dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-5" onSubmit={onSubmit}>
                        <FormInput form={form} type="email" label="Email" name="email" ph="Masukkan Email" />
                        <FormInput form={form} type="password" label="Password" name="password" ph="*********"  />
                        <Button type="submit" className="w-full cursor-pointer">
                            {isPendingLogin ? <Loader2 className="animate-spin"/> :'Sign In'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}