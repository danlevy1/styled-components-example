import React, {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    forwardRef,
} from "react";
import styled from "styled-components";

export interface ButtonProps
    extends Omit<
        DetailedHTMLProps<
            ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >,
        "className" | "style"
    > {
    children: ReactNode;
}

const StyledButton = styled.button`
    padding: 30px;
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        // @ts-expect-error className is thrown away
        className: _,
        // @ts-expect-error style is thrown away
        style: __,
        children,
        ...rest
    },
    ref
) {
    return (
        <StyledButton {...rest} ref={ref}>
            {children}
        </StyledButton>
    );
});

export default Button;
