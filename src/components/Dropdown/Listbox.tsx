import React, {
    Children,
    KeyboardEventHandler,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";
import ListboxOption, { ListboxOptionProps } from "./ListboxOption";
import { useControllableState } from "../../hooks";
import { ListboxGroup } from "./ListboxGroup";
import { VirtualizedList } from "./VirtualizedList";

type ListboxDiscriminatedProps = (
    | {
          "aria-label": string;
          "aria-labelledby"?: string;
      }
    | {
          "aria-label"?: string;
          "aria-labelledby": string;
      }
) &
    (
        | {
              selectionFollowsFocus?: false;
              multiselect?: boolean;
          }
        | {
              selectionFollowsFocus?: true;
              multiselect?: false;
          }
    );

type ListboxNonDiscriminatedProps = {
    "aria-describedby"?: string;
    value?: string[];
    onChange?: (newSelectedOptions: string[]) => void;
    isVirtualized?: boolean;
    children?: ReactNode;
};

export type ListboxProps = ListboxDiscriminatedProps &
    ListboxNonDiscriminatedProps;

const StyledListbox = styled.div`
    display: block;
    width: 100%;
    height: 100%;
    background-color: #fcfcfc;
    border-radius: 4px;
    border: 1px solid #c7c7c7;
    box-shadow: 0px 0px 10px rgba(227, 227, 227, 0.9);
    padding: 10px 0;
    overflow: auto;
`;

const Listbox = ({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    selectionFollowsFocus = false,
    multiselect = false,
    value: externalValue,
    onChange: externalOnChange,
    isVirtualized = false,
    children,
}: ListboxProps) => {
    const listboxRef = useRef<HTMLUListElement>(null);
    const [activeOptionValue, setActiveOptionValue] = useState<string | null>(
        null
    );
    const [selectedOptionValues, setSelectedOptionValues] =
        useControllableState<string[]>({
            value: externalValue,
            initialValue: [],
            onChange: externalOnChange,
        });

    const groupsAndOptionsFlatList = useMemo(() => {
        const flatArray: ReactElement[] = [];

        Children.forEach(children, (_child) => {
            const child = _child as ReactElement;
            flatArray.push(child);

            if ((child as ReactElement).type === ListboxGroup) {
                const childrenOfListboxGroup = child.props.children;
                flatArray.push(
                    ...(Children.toArray(
                        childrenOfListboxGroup
                    ) as ReactElement[])
                );
            }
        });

        return flatArray;
    }, [children]);

    const optionValuesList = useMemo((): string[] => {
        return (
            groupsAndOptionsFlatList.filter((child) => {
                return (child as ReactElement).type === ListboxOption;
            }) as ReactElement<ListboxOptionProps>[]
        ).map((child) => child.props.value);
    }, [groupsAndOptionsFlatList]);

    const getIndexOfOptionInList = useCallback(
        (optionValue: string): number => {
            return optionValuesList.findIndex((value) => value === optionValue);
        },
        [optionValuesList]
    );

    const getFirstOptionValue = useCallback((): string | null => {
        return optionValuesList.length > 0 ? optionValuesList[0] : null;
    }, [optionValuesList]);

    const getLastOptionValue = useCallback((): string | null => {
        return optionValuesList.length > 0
            ? optionValuesList[optionValuesList.length - 1]
            : null;
    }, [optionValuesList]);

    const getCurrentOptionValue = useCallback((): {
        currentOptionValue: string | null;
        indexOfCurrentOption: number;
    } => {
        let currentOptionValue: string | null;
        const indexOfFirstSelectedOption = getIndexOfOptionInList(
            selectedOptionValues?.[0]
        );

        if (multiselect === true || activeOptionValue !== null) {
            currentOptionValue = activeOptionValue;
        } else {
            currentOptionValue = optionValuesList[indexOfFirstSelectedOption];
        }

        return {
            currentOptionValue,
            indexOfCurrentOption: currentOptionValue
                ? getIndexOfOptionInList(currentOptionValue)
                : -1,
        };
    }, [
        getIndexOfOptionInList,
        selectedOptionValues,
        multiselect,
        activeOptionValue,
        optionValuesList,
    ]);

    const getNextOptionValue = useCallback((): string | null => {
        const { currentOptionValue: currentOption, indexOfCurrentOption } =
            getCurrentOptionValue();

        if (currentOption === null) {
            // This occurs on the first arrow down
            return getFirstOptionValue();
        }

        if (indexOfCurrentOption === optionValuesList.length - 1) {
            // There is no next option
            return currentOption;
        }

        return optionValuesList[indexOfCurrentOption + 1];
    }, [getCurrentOptionValue, getFirstOptionValue, optionValuesList]);

    const getPreviousOptionValue = useCallback((): string | null => {
        const { currentOptionValue: currentOption, indexOfCurrentOption } =
            getCurrentOptionValue();

        if (currentOption == null) {
            // This occurs on the first arrow up
            return getLastOptionValue();
        }

        if (indexOfCurrentOption === 0) {
            // There is no previous option
            return currentOption;
        }

        return optionValuesList[indexOfCurrentOption - 1];
    }, [getCurrentOptionValue, getLastOptionValue, optionValuesList]);

    const toggleOptionSelection = useCallback(
        (selectedOptionValues: string[], optionToToggle: string): string[] => {
            if (selectedOptionValues.includes(optionToToggle)) {
                // Removes the active option value from the list
                return selectedOptionValues.filter(
                    (selectedOptionValue) =>
                        selectedOptionValue !== optionToToggle
                );
            }

            // Adds the active option value to the end of the list
            return [...selectedOptionValues, optionToToggle];
        },
        []
    );

    const selectAllOptionValuesInRange = useCallback(
        (
            selectedOptionValues: string[],
            startIndexInclusive: number,
            endIndexInclusive: number
        ): string[] => {
            const optionValuesInRange = optionValuesList.slice(
                startIndexInclusive,
                endIndexInclusive + 1
            );
            return Array.from(
                new Set([...selectedOptionValues, ...optionValuesInRange])
            );
        },
        [optionValuesList]
    );

    const handleKeyDown: KeyboardEventHandler = (evt): void => {
        switch (evt.key) {
            case "ArrowUp": {
                const previousOptionValue = getPreviousOptionValue();
                setActiveOptionValue(previousOptionValue);

                if (
                    multiselect === true &&
                    evt.shiftKey === true &&
                    previousOptionValue !== null
                ) {
                    setSelectedOptionValues((currentSelectedOptionValues) => {
                        return toggleOptionSelection(
                            currentSelectedOptionValues,
                            previousOptionValue
                        );
                    });
                }

                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        previousOptionValue ? [previousOptionValue] : []
                    );
                }
                break;
            }
            case "ArrowDown": {
                const nextOptionValue = getNextOptionValue();
                setActiveOptionValue(nextOptionValue);

                if (
                    multiselect === true &&
                    evt.shiftKey === true &&
                    nextOptionValue !== null
                ) {
                    setSelectedOptionValues((currentSelectedOptionValues) => {
                        return toggleOptionSelection(
                            currentSelectedOptionValues,
                            nextOptionValue
                        );
                    });
                }

                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        nextOptionValue ? [nextOptionValue] : []
                    );
                }

                break;
            }
            case "Home": {
                const firstOptionValue = getFirstOptionValue();
                setActiveOptionValue(firstOptionValue);

                if (
                    multiselect === true &&
                    (evt.ctrlKey === true || evt.metaKey == true) &&
                    evt.shiftKey === true
                ) {
                    setSelectedOptionValues((currentSelectedOptionValues) => {
                        return selectAllOptionValuesInRange(
                            currentSelectedOptionValues,
                            0,
                            getCurrentOptionValue().indexOfCurrentOption
                        );
                    });
                }

                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        firstOptionValue ? [firstOptionValue] : []
                    );
                }

                break;
            }
            case "End": {
                const lastOptionValue = getLastOptionValue();
                setActiveOptionValue(lastOptionValue);

                if (
                    multiselect === true &&
                    (evt.ctrlKey === true || evt.metaKey == true) &&
                    evt.shiftKey === true
                ) {
                    setSelectedOptionValues((currentSelectedOptionValues) => {
                        return selectAllOptionValuesInRange(
                            currentSelectedOptionValues,
                            getCurrentOptionValue().indexOfCurrentOption,
                            optionValuesList.length - 1
                        );
                    });
                }

                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        lastOptionValue ? [lastOptionValue] : []
                    );
                }

                break;
            }
            case "a":
                if (
                    multiselect === true &&
                    (evt.ctrlKey === true || evt.metaKey == true)
                ) {
                    setSelectedOptionValues((currentSelectedOptionValues) => {
                        return selectAllOptionValuesInRange(
                            currentSelectedOptionValues,
                            0,
                            optionValuesList.length - 1
                        );
                    });

                    evt.preventDefault();
                }

                break;
            case " ":
            case "Enter": {
                setSelectedOptionValues((currentSelectedOptionValues) => {
                    if (activeOptionValue) {
                        if (multiselect) {
                            return toggleOptionSelection(
                                currentSelectedOptionValues,
                                activeOptionValue
                            );
                        }

                        // Single-select - sets the list to include only the active option value
                        return [activeOptionValue];
                    }

                    // No active option - returns the current list
                    return currentSelectedOptionValues;
                });
            }
        }
    };

    return (
        <>
            <StyledListbox
                role="listbox"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-describedby={ariaDescribedby}
                tabIndex={0}
                // aria-activedescendant={
                //     activeOptionValue?.elementRef.current?.id
                // }
                aria-multiselectable={multiselect}
                ref={listboxRef}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    setActiveOptionValue(null);
                }}
            >
                <ListboxContext.Provider
                    value={{
                        activeOptionValue,
                        onActiveOptionValueChange: setActiveOptionValue,
                        selectedOptionValues,
                        onSelectedOptionValuesChange: setSelectedOptionValues,
                        multiselect,
                    }}
                >
                    {isVirtualized ? (
                        <VirtualizedList>{children}</VirtualizedList>
                    ) : (
                        children
                    )}
                </ListboxContext.Provider>
            </StyledListbox>
        </>
    );
};

export default Listbox;
