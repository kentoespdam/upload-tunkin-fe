import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cekExistingTunkin, doUpload } from "@/app/dashboard/action";
import { UploadTunkinSchema } from "@/tipes/tunkin";

export interface UseTunkinFormDialogProps {
	onSuccess?: () => void;
}

export const useTunkinFormDialog = ({
	onSuccess,
}: UseTunkinFormDialogProps = {}) => {
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

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setIsDialogOpen(open);
			if (!open) {
				// Reset form ketika dialog ditutup
				setTimeout(() => form.reset(), 300);
			}
		},
		[form],
	);

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

	return {
		form,
		onSubmit,
		isPending,
		isDialogOpen,
		handleOpenChange,
	};
};
