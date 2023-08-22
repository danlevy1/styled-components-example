import React, { useContext, useEffect, useId, useMemo, useState } from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export type ListboxOption = {
    element: HTMLLIElement | null;
    text: string;
};

export interface ListboxOptionProps {
    text: string;
}

interface StyledListboxOptionProps {
    $active: boolean;
    $selected: boolean;
    $multiselect: boolean;
}

interface StyledListboxOptionCheckboxProps {
    $selected: boolean;
}

const StyledListboxOption = styled.li<StyledListboxOptionProps>`
    display: flex;
    justify-content: start;
    align-items: center;

    cursor: pointer;

    padding: 10px;

    &:hover {
        background-color: ${({ $active }) => !$active && "#f0efef"};
    }

    background-color: ${({ $active, $selected, $multiselect }) => {
        if ($selected && !$multiselect) {
            return "lightblue";
        }

        if ($active) {
            return "#e9e7e7";
        }

        return undefined;
    }};

    &:focus {
        outline: none;
        box-shadow: inset 0 0 0 2px #4558b5;
        border-radius: 4px;
    }
`;

const StyledListboxOptionText = styled.span`
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
`;

const StyledListboxOptionCheckbox = styled.div<StyledListboxOptionCheckboxProps>`
    width: 15px;
    height: 15px;
    margin-right: 10px;

    border: 2px solid lightblue;

    border-radius: 2px;

    background-color: ${({ $selected }) => $selected && "lightblue"};
`;

const Option = ({ text }: ListboxOptionProps) => {
    const [optionElement, setOptionElement] = useState<HTMLLIElement | null>(
        null
    );
    const {
        registerOption,
        deregisterOption,
        activeOption,
        onActiveOptionChange,
        selectedOptions,
        onSelectedOptionsChange,
        multiselect,
    } = useContext(ListboxContext);
    const optionId = useId();

    const optionData: ListboxOption = useMemo(() => {
        return {
            element: optionElement,
            text,
        };
    }, [optionElement, text]);

    useEffect(() => {
        registerOption(optionData);

        return () => {
            deregisterOption(optionData);
        };
    }, [registerOption, deregisterOption, optionData]);

    const isListboxOptionSelected =
        Array.isArray(selectedOptions) &&
        selectedOptions.some(
            (selectedOption) => selectedOption?.element === optionData.element
        );

    return (
        <StyledListboxOption
            id={optionId}
            role="option"
            $active={
                optionData.element && activeOption?.element
                    ? optionData.element === activeOption.element
                    : false
            }
            $selected={isListboxOptionSelected}
            $multiselect={multiselect}
            aria-selected={multiselect ? undefined : isListboxOptionSelected}
            aria-checked={multiselect ? isListboxOptionSelected : undefined}
            ref={(element) => setOptionElement(element)}
            onMouseDown={() => {
                onActiveOptionChange(optionData);
            }}
            onClick={() => {
                onSelectedOptionsChange((currentSelectedOptions) => {
                    if (multiselect) {
                        if (
                            currentSelectedOptions &&
                            currentSelectedOptions.some(
                                (selectedOption) =>
                                    selectedOption.element ===
                                    optionData.element
                            )
                        ) {
                            return currentSelectedOptions.filter(
                                (selectedOption) =>
                                    selectedOption !== optionData
                            );
                        }

                        if (currentSelectedOptions) {
                            return [...currentSelectedOptions, optionData];
                        }
                    }

                    return [optionData];
                });
            }}
            onMouseLeave={(evt) => {
                if (evt.buttons === 1) {
                    onActiveOptionChange(null);
                }
            }}
        >
            {multiselect && (
                <StyledListboxOptionCheckbox
                    $selected={isListboxOptionSelected}
                />
            )}
            <StyledListboxOptionText>{text}</StyledListboxOptionText>
        </StyledListboxOption>
    );
};

export default Option;
