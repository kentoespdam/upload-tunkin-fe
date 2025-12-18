"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import InputZod from "@/components/form/input-zod";
import { Button } from "@/components/ui/button";
import LoadingButtonClient from "@/components/ui/button-loading";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { LoginSchema, type LoginToken } from "@/tipes/auth";
import type { BaseResponse } from "@/tipes/commons";
import { doLogin } from "./action";

const FormContent = ({
	form,
	isPending,
	onsubmit,
}: {
	form: UseFormReturn<LoginSchema>;
	isPending: boolean;
	onsubmit: (value: LoginSchema) => void;
}) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
				<FieldGroup>
					<InputZod id="username" form={form} label="Username" />
					<InputZod
						id="password"
						form={form}
						label="Password"
						inputType="password"
					/>
				</FieldGroup>
				<CardFooter>
					<Field orientation="horizontal" className="justify-end">
						<LoadingButtonClient
							title="Login"
							isPending={isPending}
							type="submit"
						/>
						<Button
							type="button"
							variant="destructive"
							onClick={() => form.reset()}
						>
							Reset
						</Button>
					</Field>
				</CardFooter>
			</form>
		</Form>
	);
};

const LoginForm = () => {
	const { push } = useRouter();
	const form = useForm<LoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const { mutate, isPending } = useMutation({
		mutationFn: doLogin,
		onSuccess: (data: BaseResponse<LoginToken>) => {
			if (data.errors) throw data.errors;
			toast.success(data.message);
			push("/");
		},
		onError: (error: string[]) => {
			toast.error(error.join("\n"));
		},
	});

	const onsubmit = useCallback(
		(value: LoginSchema) => {
			mutate(value);
		},
		[mutate],
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your username below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormContent form={form} onsubmit={onsubmit} isPending={isPending} />
			</CardContent>
		</Card>
	);
};

export default LoginForm;
