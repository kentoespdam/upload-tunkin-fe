"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodField } from "@/components/form/zod-field";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useUploadTunkin } from "@/hooks/use-upload-tunkin";
import { BULAN_OPTIONS, TAHUN_OPTIONS } from "@/tipes/options";
import { UploadTunkinSchema } from "@/tipes/tunkin";

export const UploadTunkinDialog = memo(() => {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [confirmResolve, setConfirmResolve] = useState<
		((value: boolean) => void) | null
	>(null);
	const [confirmPeriode, setConfirmPeriode] = useState("");

	const confirmOverwrite = useCallback((periode: string) => {
		setConfirmPeriode(periode);
		setIsConfirmOpen(true);
		return new Promise<boolean>((resolve) => {
			setConfirmResolve(() => resolve);
		});
	}, []);

	const { submit, phase } = useUploadTunkin({
		confirmOverwrite,
		onSuccess: () => {
			setIsDialogOpen(false);
			toast.success("Data Tunkin berhasil diupload");
			router.refresh();
		},
	});

	const form = useForm<UploadTunkinSchema>({
		resolver: zodResolver(UploadTunkinSchema),
		defaultValues: {
			tahun: new Date().getFullYear().toString(),
			bulan: (new Date().getMonth() + 1).toString().padStart(2, "0"),
			file: "",
		},
	});

	const onSubmit = async (values: UploadTunkinSchema) => {
		const file = values.file as unknown as File;
		if (!file) {
			toast.error("File wajib diisi");
			return;
		}

		const result = await submit({
			file,
			periode: `${values.tahun}${values.bulan}`,
		});

		if (!result.ok && result.reason !== "cancelled") {
			toast.error(
				Array.isArray(result.error)
					? result.error.join("\n")
					: (result.error as string) || "Gagal upload",
			);
		}
	};

	const handleConfirm = (value: boolean) => {
		setIsConfirmOpen(false);
		confirmResolve?.(value);
	};

	const isPending = phase !== "idle" && phase !== "done" && phase !== "error";

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FieldGroup>
								<ZodField
									id="tahun"
									form={form}
									label="Tahun"
									variant="select"
									options={TAHUN_OPTIONS}
								/>
								<ZodField
									id="bulan"
									form={form}
									label="Bulan"
									variant="select"
									options={BULAN_OPTIONS}
								/>
								<ZodField
									id="file"
									form={form}
									label="File Tunkin"
									variant="file"
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
				</DialogContent>
			</Dialog>

			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Konfirmasi Overwrite</AlertDialogTitle>
						<AlertDialogDescription>
							Data Tunkin untuk periode {confirmPeriode} sudah ada. Apakah Anda
							ingin melanjutkan dan menimpa data yang ada?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => handleConfirm(false)}>
							Batal
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleConfirm(true)}>
							Lanjut Overwrite
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
});

UploadTunkinDialog.displayName = "UploadTunkinDialog";

export default UploadTunkinDialog;
