import React, {
    KeyboardEventHandler,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";
import useComponentRegistration from "./useComponentRegistration";
import { ListboxOptionData } from "./ListboxOption";
import { useControllableState } from "../../hooks";

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
    children?: ReactNode;
};

export type ListboxProps = ListboxDiscriminatedProps &
    ListboxNonDiscriminatedProps;

const StyledListbox = styled.ul`
    display: inline-block;
    min-width: 200px;
    max-width: 500px;
    background-color: #fcfcfc;
    border-radius: 4px;
    border: 1px solid #c7c7c7;
    box-shadow: 0px 0px 10px rgba(227, 227, 227, 0.9);
    padding: 10px 0;
`;

const Listbox = ({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    selectionFollowsFocus = false,
    multiselect = false,
    value: externalValue,
    onChange: externalOnChange,
    children,
}: ListboxProps) => {
    const listboxRef = useRef<HTMLUListElement>(null);
    const [activeOption, setActiveOption] = useState<ListboxOptionData | null>(
        null
    );
    const [selectedOptionValues, setSelectedOptionValues] =
        useControllableState<string[]>({
            value: externalValue,
            initialValue: [],
            onChange: externalOnChange,
        });

    const [registerOption, deregisterOption, optionList] =
        useComponentRegistration<ListboxOptionData>();

    const getIndexOfOptionInList = useCallback(
        (optionValue: string): number => {
            return optionList.findIndex(({ value }) => value === optionValue);
        },
        [optionList]
    );

    const getFirstOption = useCallback((): ListboxOptionData | null => {
        return optionList.length > 0 ? optionList[0] : null;
    }, [optionList]);

    const getLastOption = useCallback((): ListboxOptionData | null => {
        return optionList.length > 0 ? optionList[optionList.length - 1] : null;
    }, [optionList]);

    const getCurrentOption = useCallback((): {
        currentOption: ListboxOptionData | null;
        indexOfCurrentOption: number;
    } => {
        let currentOption: ListboxOptionData | null;
        const indexOfFirstSelectedOption = getIndexOfOptionInList(
            selectedOptionValues?.[0]
        );

        if (multiselect === true || activeOption !== null) {
            currentOption = activeOption;
        } else {
            currentOption = optionList[indexOfFirstSelectedOption];
        }

        return {
            currentOption,
            indexOfCurrentOption: currentOption
                ? getIndexOfOptionInList(currentOption.value)
                : -1,
        };
    }, [
        getIndexOfOptionInList,
        selectedOptionValues,
        multiselect,
        activeOption,
        optionList,
    ]);

    const getNextOption = useCallback((): ListboxOptionData | null => {
        const { currentOption, indexOfCurrentOption } = getCurrentOption();

        if (currentOption === null) {
            // This occurs on the first arrow down
            return getFirstOption();
        }

        if (indexOfCurrentOption === optionList.length - 1) {
            // There is no next option
            return currentOption;
        }

        return optionList[indexOfCurrentOption + 1];
    }, [getCurrentOption, getFirstOption, optionList]);

    const getPreviousOption = useCallback((): ListboxOptionData | null => {
        const { currentOption, indexOfCurrentOption } = getCurrentOption();

        if (currentOption == null) {
            // This occurs on the first arrow up
            return getLastOption();
        }

        if (indexOfCurrentOption === 0) {
            // There is no previous option
            return currentOption;
        }

        return optionList[indexOfCurrentOption - 1];
    }, [getCurrentOption, getLastOption, optionList]);

    const handleKeyDown: KeyboardEventHandler = (evt): void => {
        switch (evt.key) {
            case "ArrowUp": {
                const previousOption = getPreviousOption();
                setActiveOption(previousOption);
                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        previousOption ? [previousOption.value] : []
                    );
                }
                break;
            }
            case "ArrowDown": {
                const nextOption = getNextOption();
                setActiveOption(nextOption);
                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        nextOption ? [nextOption.value] : []
                    );
                }

                break;
            }
            case "Home": {
                const firstOption = getFirstOption();
                setActiveOption(firstOption);
                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        firstOption ? [firstOption.value] : []
                    );
                }

                break;
            }
            case "End": {
                const lastOption = getLastOption();
                setActiveOption(lastOption);
                if (selectionFollowsFocus === true) {
                    setSelectedOptionValues(
                        lastOption ? [lastOption.value] : []
                    );
                }

                break;
            }
            case " ":
            case "Enter": {
                setSelectedOptionValues((currentSelectedOptionValues) => {
                    if (activeOption) {
                        if (multiselect) {
                            if (
                                currentSelectedOptionValues.includes(
                                    activeOption.value
                                )
                            ) {
                                // Removes the active option value from the list
                                return currentSelectedOptionValues.filter(
                                    (selectedOptionValue) =>
                                        selectedOptionValue !==
                                        activeOption.value
                                );
                            }

                            // Adds the active option value to the end of the list
                            return [
                                ...currentSelectedOptionValues,
                                activeOption.value,
                            ];
                        }

                        // Single-select - sets the list to include only the active option value
                        return [activeOption.value];
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
                aria-activedescendant={activeOption?.element?.id}
                aria-multiselectable={multiselect}
                ref={listboxRef}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    setActiveOption(null);
                }}
            >
                <ListboxContext.Provider
                    value={{
                        registerOption,
                        deregisterOption,
                        activeOption,
                        onActiveOptionChange: setActiveOption,
                        selectedOptionValues,
                        onSelectedOptionValuesChange: setSelectedOptionValues,
                        multiselect,
                    }}
                >
                    {children}
                </ListboxContext.Provider>
            </StyledListbox>
        </>
    );
};

export default Listbox;
