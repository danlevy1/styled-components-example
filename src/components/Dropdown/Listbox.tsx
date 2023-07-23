import React, { ComponentPropsWithoutRef, useRef } from "react";
import styled from "styled-components";
import useOptionSelection from "./useOptionSelection";
import { ListboxContext } from "./ListboxContext";

export interface ListboxProps
    extends Pick<ComponentPropsWithoutRef<"div">, "children"> {}

const StyledListbox = styled.ul`
    display: inline-block;
    min-width: 200px;
    max-width: 500px;
    background-color: #fcfcfc;
    border-radius: 4px;
    border: 1px solid #c7c7c7;
    box-shadow: 0px 0px 10px rgba(227, 227, 227, 0.9);
    padding: 10px 0;
`;

const Listbox = ({ children }: ListboxProps) => {
    const listboxRef = useRef<HTMLUListElement>(null);
    const { registerOption, deregisterOption, activeOption } =
        useOptionSelection(listboxRef.current);

    return (
        <StyledListbox
            role="listbox"
            tabIndex={0}
            aria-activedescendant={activeOption?.element.id}
            ref={listboxRef}
        >
            <ListboxContext.Provider
                value={{
                    registerOption,
                    deregisterOption,
                }}
            >
                {children}
            </ListboxContext.Provider>
        </StyledListbox>
    );
};

export default Listbox;
