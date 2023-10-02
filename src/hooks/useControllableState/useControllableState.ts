import { useState, Dispatch, SetStateAction } from "react";
import { useCallbackRef } from "../useCallbackRef";

export interface UseControllableStateParams<V> {
    value?: V;
    initialValue: V | (() => V);
    onChange?: (value: V) => void;
}

const shouldUpdateValue = <V>(currentValue: V, nextValue: V) => {
    return currentValue !== nextValue;
};

/**
 * The `useControllableState` hook returns the state and function that updates the state, just like useState does.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-controllable#usecontrollablestate
 */
export function useControllableState<V>({
    value: externalValue,
    initialValue: externalInitialValue,
    onChange: externalOnChange,
}: UseControllableStateParams<V>): [V, Dispatch<SetStateAction<V>>] {
    const [internalState, setInternalState] = useState(externalInitialValue);

    const internalOnChange = useCallbackRef(externalOnChange);

    const isValueControlled = externalValue !== undefined;
    const internalValue = isValueControlled ? externalValue : internalState;

    const setValue = useCallbackRef(
        (nextValueOrFunction: SetStateAction<V>) => {
            const getNextValueFromFunction = nextValueOrFunction as (
                currentState?: V
            ) => V;

            const nextValue =
                typeof nextValueOrFunction === "function"
                    ? getNextValueFromFunction(internalValue)
                    : nextValueOrFunction;

            if (shouldUpdateValue(internalValue, nextValue)) {
                if (!isValueControlled) {
                    setInternalState(nextValue);
                }

                internalOnChange(nextValue);
            }
        },
        [isValueControlled, internalOnChange, internalValue]
    );

    return [internalValue, setValue];
}
