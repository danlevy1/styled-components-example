import React, { ReactNode, useCallback, useRef, useState } from "react";
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

    const getIndexOfOption = useCallback(
        (option: ListboxOptionData) => {
            for (let i = 0; i < optionList.length; i++) {
                if (optionList[i].element === option.element) {
                    return i;
                }
            }

            return -1;
        },
        [optionList]
    );

    const getFirstOption = useCallback((): ListboxOptionData | null => {
        if (optionList.length > 0) {
            return optionList[0];
        }

        return null;
    }, [optionList]);

    const getLastOption = useCallback((): ListboxOptionData | null => {
        if (optionList.length > 0) {
            return optionList[optionList.length - 1];
        }

        return null;
    }, [optionList]);

    const getNextOption = useCallback((): ListboxOptionData | null => {
        // TODO: Does this work?
        const currentOption = multiselect
            ? activeOption
            : activeOption ??
              optionList[
                  optionList.findIndex(
                      ({ value }) => value === selectedOptionValues?.[0]
                  )
              ];

        if (currentOption == null) {
            return getFirstOption();
        }

        const indexOfCurrentOption = currentOption
            ? getIndexOfOption(currentOption)
            : -1;

        if (indexOfCurrentOption === optionList.length - 1) {
            return currentOption;
        }

        return optionList[indexOfCurrentOption + 1];
    }, [
        getFirstOption,
        activeOption,
        selectedOptionValues,
        getIndexOfOption,
        optionList,
        multiselect,
    ]);

    const getPreviousOption = useCallback((): ListboxOptionData | null => {
        // TODO: Does this work?
        const currentOption = multiselect
            ? activeOption
            : activeOption ??
              optionList[
                  optionList.findIndex(
                      ({ value }) => value === selectedOptionValues?.[0]
                  )
              ];

        if (currentOption == null) {
            return getLastOption();
        }

        const indexOfCurrentOption = currentOption
            ? getIndexOfOption(currentOption)
            : optionList.length - 1;

        if (indexOfCurrentOption === 0) {
            return currentOption;
        }

        return optionList[indexOfCurrentOption - 1];
    }, [
        getLastOption,
        activeOption,
        selectedOptionValues,
        getIndexOfOption,
        optionList,
        multiselect,
    ]);

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
                onKeyDown={(evt) => {
                    switch (evt.key) {
                        case "ArrowUp": {
                            const previousOption = getPreviousOption();
                            setActiveOption(previousOption);
                            selectionFollowsFocus &&
                                setSelectedOptionValues(
                                    previousOption ? [previousOption.value] : []
                                );
                            break;
                        }
                        case "ArrowDown": {
                            const nextOption = getNextOption();
                            setActiveOption(nextOption);
                            selectionFollowsFocus &&
                                setSelectedOptionValues(
                                    nextOption ? [nextOption.value] : []
                                );
                            break;
                        }
                        case "Home": {
                            const firstOption = getFirstOption();
                            setActiveOption(firstOption);
                            selectionFollowsFocus &&
                                setSelectedOptionValues(
                                    firstOption ? [firstOption.value] : []
                                );
                            break;
                        }
                        case "End": {
                            const lastOption = getLastOption();
                            setActiveOption(lastOption);
                            selectionFollowsFocus &&
                                setSelectedOptionValues(
                                    lastOption ? [lastOption.value] : []
                                );
                            break;
                        }
                        case " ":
                        case "Enter": {
                            setSelectedOptionValues(
                                (currentSelectedOptionValues) => {
                                    if (activeOption) {
                                        if (multiselect) {
                                            if (
                                                currentSelectedOptionValues.includes(
                                                    activeOption.value
                                                )
                                            ) {
                                                return currentSelectedOptionValues.filter(
                                                    (selectedOptionValue) =>
                                                        selectedOptionValue !==
                                                        activeOption?.value
                                                );
                                            }

                                            if (currentSelectedOptionValues) {
                                                return [
                                                    ...currentSelectedOptionValues,
                                                    activeOption.value,
                                                ];
                                            }
                                        }

                                        return [activeOption.value];
                                    }

                                    return currentSelectedOptionValues;
                                }
                            );
                        }
                    }
                }}
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
