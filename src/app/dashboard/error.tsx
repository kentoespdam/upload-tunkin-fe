"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("DashboardPage error:", error);
	}, [error]);

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mx-auto max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
				<h2 className="text-lg font-semibold text-destructive">
					Gagal memuat dashboard
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{error.message || "Terjadi kesalahan tidak terduga."}
				</p>
				<div className="mt-6 flex justify-center gap-2">
					<Button type="button" variant="outline" onClick={() => reset()}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Coba lagi
					</Button>
					<Button type="button" asChild>
						<a href="/login">Login ulang</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
