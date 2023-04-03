import React, {
    DetailedHTMLProps,
    IframeHTMLAttributes,
    ReactNode,
    forwardRef,
} from "react";
import styled from "styled-components";

export interface IframeProps
    extends Omit<
        DetailedHTMLProps<
            IframeHTMLAttributes<HTMLIFrameElement>,
            HTMLIFrameElement
        >,
        "className" | "style"
    > {
    children?: ReactNode;
}

const StyledIframe = styled.iframe`
    width: 200px;
    height: 200px;
    border: 1px solid ${(props) => props.theme.color.gray};
    box-sizing: border-box;
`;

const Iframe = forwardRef<HTMLIFrameElement, IframeProps>(function Iframe(
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
        <StyledIframe {...rest} ref={ref}>
            {children}
        </StyledIframe>
    );
});

export default Iframe;
