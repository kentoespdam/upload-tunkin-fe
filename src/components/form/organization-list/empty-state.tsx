"use client";

import { memo } from "react";

type EmptyStateProps = {
	message: string;
	hasSearch: boolean;
};

const EmptyState = memo(({ message, hasSearch }: EmptyStateProps) => (
	<div className="flex flex-col items-center justify-center p-6 text-center">
		<div className="mb-3 h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
			<span className="text-muted-foreground text-2xl">🏢</span>
		</div>
		<p className="text-sm text-muted-foreground mb-2">
			{hasSearch ? "No matching organizations found" : message}
		</p>
		{hasSearch && (
			<p className="text-xs text-muted-foreground">
				Try a different search term
			</p>
		)}
	</div>
));
EmptyState.displayName = "EmptyState";

export default EmptyState;
