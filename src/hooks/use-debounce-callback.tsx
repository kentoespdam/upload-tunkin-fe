"use client";

import debounce from "lodash.debounce";
import * as React from "react";

import { useUnmount } from "./use-unmount";

type DebounceOptions = {
	leading?: boolean;
	trailing?: boolean;
	maxWait?: number;
};

type ControlFunctions = {
	cancel: () => void;
	flush: () => void;
	isPending: () => boolean;
};

export type DebouncedState<Args extends unknown[], Return> = ((
	...args: Args
) => Return | undefined) &
	ControlFunctions;

export function useDebounceCallback<Args extends unknown[], Return>(
	func: (...args: Args) => Return,
	delay = 500,
	options?: DebounceOptions,
): DebouncedState<Args, Return> {
	const debouncedFunc = React.useRef<ReturnType<typeof debounce>>(null);

	useUnmount(() => {
		if (debouncedFunc.current) {
			debouncedFunc.current.cancel();
		}
	});

	const debounced = React.useMemo(() => {
		const debouncedFuncInstance = debounce(func, delay, options);

		const wrappedFunc: DebouncedState<Args, Return> = (...args: Args) => {
			return debouncedFuncInstance(...args);
		};

		wrappedFunc.cancel = () => {
			debouncedFuncInstance.cancel();
		};

		wrappedFunc.isPending = () => {
			return !!debouncedFunc.current;
		};

		wrappedFunc.flush = () => {
			return debouncedFuncInstance.flush();
		};

		return wrappedFunc;
	}, [func, delay, options]);

	React.useEffect(() => {
		debouncedFunc.current = debounce(func, delay, options);
	}, [func, delay, options]);

	return debounced;
}
