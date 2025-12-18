"use client";
import { UploadCloudIcon } from "lucide-react";
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import BulanZod from "@/components/form/bulan-zod";
import InputFileZod from "@/components/form/file-zod";
import TahunZod from "@/components/form/tahun-zod";
import { Button } from "@/components/ui/button";
import LoadingButtonClient from "@/components/ui/button-loading";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { useTunkinFormDialog } from "@/hooks/upload-hook";
import type { UploadTunkinSchema } from "@/tipes/tunkin";

type FormComponentProps = {
	form: UseFormReturn<UploadTunkinSchema>;
	onSubmit: (value: UploadTunkinSchema) => void;
	isPending: boolean;
};
const FormComponent = memo(
	({ form, onSubmit, isPending }: FormComponentProps) => {
		// const { form, onSubmit, isPending } = useTunkinFormDialog();

		return (
			<div className="grid gap-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FieldGroup>
							<TahunZod id="tahun" form={form} />
							<BulanZod id="bulan" form={form} />
							<InputFileZod
								id="file"
								form={form}
								label="File Tunkin"
								accept=".xlsx,.xls"
							/>
						</FieldGroup>

						<DialogFooter className="gap-2 sm:gap-0">
							<LoadingButtonClient
								isPending={isPending}
								title="Upload"
								type="submit"
							/>
							<DialogClose asChild className="ml-2">
								<Button type="reset" variant="destructive">
									Batal
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</div>
		);
	},
);
FormComponent.displayName = "FormComponent";

const TunkinFormDialog = memo(() => {
	const { isDialogOpen, handleOpenChange, form, onSubmit, isPending } =
		useTunkinFormDialog();

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<UploadCloudIcon className="size-5" />
					<span>Upload Tunkin</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Form Upload Tunkin</DialogTitle>
				</DialogHeader>
				<FormComponent form={form} onSubmit={onSubmit} isPending={isPending} />
			</DialogContent>
		</Dialog>
	);
});

TunkinFormDialog.displayName = "TunkinFormDialog";

export default TunkinFormDialog;
