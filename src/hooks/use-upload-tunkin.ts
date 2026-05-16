import { useState } from "react";
import { doUpload } from "@/app/dashboard/action";

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
			reason:
				| "probe-failed"
				| "upload-failed"
				| "cancelled"
				| "upload-conflict";
			error?: string[] | string;
	  };

interface UseUploadTunkinOptions {
	confirmOverwrite: (periode: string, count: number) => Promise<boolean>;
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
			const probeRes = await fetch(
				`/api/proxy/tunkin/exists/${values.periode}`,
				{ credentials: "same-origin" },
			);

			if (!probeRes.ok) {
				throw new Error("Gagal mengecek data eksis");
			}

			const probeData = (await probeRes.json()) as any;

			// Handle both BaseResponse structure and flat structure
			const isSuccess = probeData.ok === true || probeData.status === 200;
			const probe = probeData.data || probeData;

			if (!isSuccess && probeData.ok !== undefined) {
				throw new Error(probeData.message || "Gagal mengecek data eksis");
			}

			if (probe && typeof probe.exists === "boolean" && probe.exists) {
				setPhase("confirming");
				const confirmed = await confirmOverwrite(values.periode, probe.count);
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
				if (result.status === 409) {
					setPhase("error");
					setError(result.message);
					return {
						ok: false,
						reason: "upload-conflict",
						error: result.message,
					};
				}

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
