import React, { CSSProperties, ForwardedRef, ReactNode, useId } from "react";
import styled from "styled-components";

export interface ListboxGroupProps {
    text: string;
    "aria-describedby"?: string;
    private_windowingStyles?: CSSProperties;
    private_windowingRef?: ForwardedRef<HTMLDivElement>;
    children?: ReactNode;
}

const StyledListboxGroup = styled.div`
    width: 100%;

    padding: 20px 10px 10px 10px;

    &:first-child {
        padding-top: 10px;
    }
`;

const StyledListboxGroupText = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
    text-transform: uppercase;
`;

export const ListboxGroup = ({
    text,
    "aria-describedby": ariaDescribedBy,
    private_windowingStyles,
    private_windowingRef,
    children,
}: ListboxGroupProps) => {
    const textId = useId();

    return (
        <StyledListboxGroup
            role="group"
            aria-labelledby={textId}
            aria-describedby={ariaDescribedBy}
            style={private_windowingStyles}
            ref={private_windowingRef}
        >
            <StyledListboxGroupText id={textId}>{text}</StyledListboxGroupText>
            <div>{children}</div>
        </StyledListboxGroup>
    );
};
