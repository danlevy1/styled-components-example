import React, { CSSProperties, ForwardedRef, useContext, useId } from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export interface ListboxOptionProps {
    text: string;
    value: string;
    private_windowingStyles?: CSSProperties;
    private_windowingRef?: ForwardedRef<HTMLDivElement>;
}

interface StyledListboxOptionProps {
    $active: boolean;
    $selected: boolean;
    $multiselect: boolean;
}

interface StyledListboxOptionCheckboxProps {
    $selected: boolean;
}

const StyledListboxOption = styled.div<StyledListboxOptionProps>`
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

const ListboxOption = ({
    text,
    value,
    private_windowingStyles,
    private_windowingRef,
}: ListboxOptionProps) => {
    const {
        activeOptionValue,
        onActiveOptionValueChange,
        selectedOptionValues,
        onSelectedOptionValuesChange,
        multiselect,
    } = useContext(ListboxContext);
    const optionId = useId();

    const isListboxOptionSelected = selectedOptionValues.includes(value);

    return (
        <StyledListboxOption
            id={optionId}
            role="option"
            $active={activeOptionValue ? value === activeOptionValue : false}
            $selected={isListboxOptionSelected}
            $multiselect={multiselect}
            aria-selected={multiselect ? undefined : isListboxOptionSelected}
            aria-checked={multiselect ? isListboxOptionSelected : undefined}
            ref={private_windowingRef}
            style={private_windowingStyles}
            onMouseDown={() => {
                onActiveOptionValueChange(value);
            }}
            onClick={() => {
                onSelectedOptionValuesChange((currentSelectedOptionValues) => {
                    if (multiselect) {
                        if (
                            currentSelectedOptionValues &&
                            currentSelectedOptionValues.includes(value)
                        ) {
                            return currentSelectedOptionValues.filter(
                                (selectedOptionValue) =>
                                    selectedOptionValue !== value
                            );
                        }

                        if (currentSelectedOptionValues) {
                            return [...currentSelectedOptionValues, value];
                        }
                    }

                    return [value];
                });
            }}
            onMouseLeave={(evt) => {
                if (evt.buttons === 1) {
                    onActiveOptionValueChange(null);
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
