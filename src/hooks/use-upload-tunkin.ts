import { useState } from "react";
import { cekExistingTunkin, doUpload } from "@/app/dashboard/action";

export type UploadPhase =
	| "idle"
	| "probing"
	| "confirming"
	| "uploading"
	| "done"
	| "error";

export type UploadResult =
	| { ok: true }
	| {
			ok: false;
			reason: "probe-failed" | "upload-failed" | "cancelled";
			error?: string[] | string;
	  };

interface UseUploadTunkinOptions {
	confirmOverwrite: (periode: string) => Promise<boolean>;
	onSuccess?: () => void;
}

export const useUploadTunkin = ({
	confirmOverwrite,
	onSuccess,
}: UseUploadTunkinOptions) => {
	const [phase, setPhase] = useState<UploadPhase>("idle");
	const [error, setError] = useState<string | null>(null);

	const submit = async (values: {
		file: File;
		periode: string;
	}): Promise<UploadResult> => {
		setPhase("probing");
		setError(null);

		try {
			const probe = await cekExistingTunkin(values.periode);

			if (probe.is_exist) {
				setPhase("confirming");
				const confirmed = await confirmOverwrite(values.periode);
				if (!confirmed) {
					setPhase("idle");
					return { ok: false, reason: "cancelled" };
				}
			}

			setPhase("uploading");
			const formData = new FormData();
			formData.append("file", values.file, values.file.name);
			formData.append("periode", values.periode);

			const result = await doUpload(formData);

			if (!result.ok) {
				setPhase("error");
				setError(result.message);
				return {
					ok: false,
					reason: "upload-failed",
					error: result.errors || result.message,
				};
			}

			setPhase("done");
			onSuccess?.();
			setPhase("idle");
			return { ok: true };
		} catch (e: unknown) {
			setPhase("error");
			const msg =
				e instanceof Error ? e.message : "An unexpected error occurred";
			setError(msg);
			return { ok: false, reason: "probe-failed", error: msg };
		}
	};

	return { phase, error, submit };
};
