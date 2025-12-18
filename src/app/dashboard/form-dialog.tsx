"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadCloudIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { UploadTunkinSchema } from "@/tipes/tunkin";
import { cekExistingTunkin, doUpload } from "./action";

interface UseTunkinFormDialogProps {
	onSuccess?: () => void;
}

const useTunkinFormDialog = ({ onSuccess }: UseTunkinFormDialogProps = {}) => {
	const now = new Date();
	const params = useSearchParams();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const form = useForm<UploadTunkinSchema>({
		resolver: zodResolver(UploadTunkinSchema),
		defaultValues: {
			tahun: now.getFullYear().toString(),
			bulan: (now.getMonth() + 1).toString().padStart(2, "0"),
			file: "",
		},
	});

	const qc = useQueryClient();

	const { mutate: uploadMutate, isPending: isUploading } = useMutation({
		mutationFn: doUpload,
		onSuccess: (data) => {
			if (data.errors) throw data.errors;
			handleOpenChange(false);

			toast.success("Data Tunkin berhasil diupload");

			// Reset form dan tutup dialog
			form.reset();
			onSuccess?.();
			qc.invalidateQueries({ queryKey: ["tunkin", params.toString()] });
		},
		onError: (error: string[]) => {
			toast.error(error.join("\n"));
		},
	});

	const { mutate: cekExistingMutate, isPending: isCheckingExisting } =
		useMutation({
			mutationFn: cekExistingTunkin,
		});

	const isPending = isUploading || isCheckingExisting;

	const onSubmit = useCallback(
		(value: UploadTunkinSchema) => {
			const file = value.file as File;
			if (!file) {
				toast.error("File wajib diisi");
				return;
			}

			const periode = `${value.tahun}${value.bulan}`;

			// Validasi periode
			if (periode.length !== 6) {
				toast.error("Format periode tidak valid");
				return;
			}

			cekExistingMutate(periode, {
				onSuccess: (data) => {
					if (data.is_exist === true) {
						const confirmProceed = window.confirm(
							`Data Tunkin untuk periode ${periode} sudah ada. Apakah Anda ingin melanjutkan dan menimpa data yang ada?`,
						);

						if (confirmProceed) {
							const formData = new FormData();
							formData.append("file", file, file.name);
							formData.append("periode", periode);
							uploadMutate(formData);
						}
					} else {
						const formData = new FormData();
						formData.append("file", file, file.name);
						formData.append("periode", periode);
						uploadMutate(formData);
					}
				},
				onError: (error) => {
					toast.error("Gagal memeriksa data existing");
					console.error("Error checking existing data:", error);
				},
			});
		},
		[cekExistingMutate, uploadMutate],
	);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			console.log(open);
			setIsDialogOpen(open);
			if (!open) {
				// Reset form ketika dialog ditutup
				setTimeout(() => form.reset(), 300);
			}
		},
		[form],
	);

	return {
		form,
		onSubmit,
		isPending,
		isDialogOpen,
		handleOpenChange,
	};
};

const FormComponent = memo(() => {
	const { form, onSubmit, isPending } = useTunkinFormDialog();

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
});
FormComponent.displayName = "FormComponent";

const TunkinFormDialog = memo(() => {
	const { isDialogOpen, handleOpenChange } = useTunkinFormDialog();

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
				<FormComponent />
			</DialogContent>
		</Dialog>
	);
});

TunkinFormDialog.displayName = "TunkinFormDialog";

export default TunkinFormDialog;
