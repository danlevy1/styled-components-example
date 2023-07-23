import React, { useContext, useEffect, useId, useMemo, useState } from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export type Option = {
    element: HTMLLIElement | null;
};

export interface OptionProps {
    text: string;
}

interface StyledOptionProps {
    $active: boolean;
}

const StyledOption = styled.li<StyledOptionProps>`
    display: flex;
    justify-content: start;
    align-items: center;

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

const StyledOptionText = styled.span`
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
`;

const Option = ({ text }: OptionProps) => {
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
        <StyledOption
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
            <StyledOptionText>{text}</StyledOptionText>
        </StyledOption>
    );
};

export default Option;
