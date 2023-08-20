import React, { useContext, useEffect, useId, useMemo, useState } from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export type ListboxOption = {
    element: HTMLLIElement | null;
};

export interface ListboxOptionProps {
    text: string;
}

interface StyledListboxOptionProps {
    $active: boolean;
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

    background-color: ${({ $active }) => $active && "#e9e7e7"};

    &:focus {
        outline: none;
        box-shadow: inset 0 0 0 2px #4558b5;
        border-radius: 4px;
    }

    &[aria-selected="true"] {
        background-color: lightblue;
    }
`;

const StyledListboxOptionText = styled.span`
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
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
        selectedOption,
        onSelectedOptionChange,
    } = useContext(ListboxContext);
    const optionId = useId();

    const optionData = useMemo(() => {
        return {
            element: optionElement,
        };
    }, [optionElement]);

    useEffect(() => {
        registerOption(optionData);

        return () => {
            deregisterOption(optionData);
        };
    }, [registerOption, deregisterOption, optionData]);

    return (
        <StyledListboxOption
            id={optionId}
            role="option"
            $active={
                optionData.element && activeOption?.element
                    ? optionData.element === activeOption.element
                    : false
            }
            aria-selected={optionData.element === selectedOption?.element}
            ref={(element) => setOptionElement(element)}
            onMouseDown={() => {
                onActiveOptionChange(optionData);
            }}
            onClick={() => {
                onSelectedOptionChange(optionData);
            }}
            onMouseLeave={(evt) => {
                if (evt.buttons === 1) {
                    onActiveOptionChange(null);
                }
            }}
        >
            <StyledListboxOptionText>{text}</StyledListboxOptionText>
        </StyledListboxOption>
    );
};

export default Option;
