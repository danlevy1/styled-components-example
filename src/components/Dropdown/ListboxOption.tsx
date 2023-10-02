import React, { useContext, useEffect, useId, useMemo, useState } from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export type ListboxOptionData = {
    element: HTMLLIElement | null;
    value: string;
};

export interface ListboxOptionProps {
    text: string;
    value: string;
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

const ListboxOption = ({ text, value }: ListboxOptionProps) => {
    const [optionElement, setOptionElement] = useState<HTMLLIElement | null>(
        null
    );
    const {
        registerOption,
        deregisterOption,
        activeOption,
        onActiveOptionChange,
        selectedOptionValues,
        onSelectedOptionValuesChange,
        multiselect,
    } = useContext(ListboxContext);
    const optionId = useId();

    const optionData = useMemo(() => {
        return {
            element: optionElement,
            value,
        } as ListboxOptionData;
    }, [optionElement, value]);

    useEffect(() => {
        registerOption(optionData);

        return () => {
            deregisterOption(optionData);
        };
    }, [registerOption, deregisterOption, optionData, value]);

    const isListboxOptionSelected =
        Array.isArray(selectedOptionValues) &&
        selectedOptionValues.includes(optionData.value);

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
                onSelectedOptionValuesChange((currentSelectedOptionValues) => {
                    if (multiselect) {
                        if (
                            currentSelectedOptionValues &&
                            currentSelectedOptionValues.includes(
                                optionData.value
                            )
                        ) {
                            return currentSelectedOptionValues.filter(
                                (selectedOptionValue) =>
                                    selectedOptionValue !== optionData.value
                            );
                        }

                        if (currentSelectedOptionValues) {
                            return [
                                ...currentSelectedOptionValues,
                                optionData.value,
                            ];
                        }
                    }

                    return [optionData.value];
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

export default ListboxOption;
