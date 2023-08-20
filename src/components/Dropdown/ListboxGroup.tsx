import React, { ReactNode, useId } from "react";
import styled from "styled-components";

export interface ListboxGroupProps {
    text: string;
    "aria-describedby"?: string;
    children?: ReactNode;
}

const StyledListboxGroup = styled.div`
    list-style-type: none;

    padding-bottom: 10px;

    &:last-of-type {
        padding-bottom: 0;
    }
`;

const StyledListboxGroupText = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
    text-transform: uppercase;

    padding: 10px;
`;

export const ListboxGroup = ({
    text,
    "aria-describedby": ariaDescribedBy,
    children,
}: ListboxGroupProps) => {
    const textId = useId();

    return (
        <StyledListboxGroup
            role="group"
            aria-labelledby={textId}
            aria-describedby={ariaDescribedBy}
        >
            <StyledListboxGroupText id={textId}>{text}</StyledListboxGroupText>
            <div>{children}</div>
        </StyledListboxGroup>
    );
};
