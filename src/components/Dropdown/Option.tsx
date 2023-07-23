import React, {
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";

export type Option = {
    element: HTMLLIElement;
    makeOptionActive: () => void;
    makeOptionInactive: () => void;
    selectOption: () => void;
    deselectOption: () => void;
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
    const [isOptionActive, setIsOptionActive] = useState(false);
    const [isOptionSelected, setIsOptionSelected] = useState(false);
    const optionElementRef = useRef<HTMLLIElement>(null);
    const { registerOption, deregisterOption } = useContext(ListboxContext);
    const optionId = useId();

    const makeOptionActive = useCallback(() => {
        setIsOptionActive(true);
    }, []);

    const makeOptionInactive = useCallback(() => {
        setIsOptionActive(false);
    }, []);

    const selectOption = useCallback(() => {
        setIsOptionSelected(true);
    }, []);

    const deselectOption = useCallback(() => {
        setIsOptionSelected(false);
    }, []);

    useEffect(() => {
        const optionElement = optionElementRef.current!;

        registerOption({
            element: optionElement,
            makeOptionActive,
            makeOptionInactive,
            selectOption,
            deselectOption,
        });

        return () => {
            deregisterOption(optionElement);
        };
    }, [
        makeOptionActive,
        makeOptionInactive,
        selectOption,
        deselectOption,
        registerOption,
        deregisterOption,
    ]);

    return (
        <StyledOption
            id={optionId}
            role="option"
            $active={isOptionActive}
            aria-selected={isOptionSelected}
            ref={optionElementRef}
            // onMouseLeave={() => console.log("REACT LEAVE")}
        >
            <StyledOptionText>{text}</StyledOptionText>
        </StyledOption>
    );
};

export default Option;
