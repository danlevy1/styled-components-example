import { useCallback, useEffect, useRef, DependencyList } from "react";

/**
 * The `useControllableState` hook returns the state and function that updates the state, just like React.useState does.
 *
 * @see Docs https://github.com/chakra-ui/chakra-ui/tree/main/packages/hooks/use-callback-ref
 */
export function useCallbackRef<C extends (...args: any[]) => void>(
    callback?: C,
    deps: DependencyList = []
): C {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        ((...args) => callbackRef.current?.(...args)) as C,
        deps
    );
}
