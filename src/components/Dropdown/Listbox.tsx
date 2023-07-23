import React, {
    ComponentPropsWithoutRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";
import useComponentRegistration from "./useComponentRegistration";
import { Option } from "./Option";

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
    const [activeOption, setActiveOption] = useState<Option | null>(null);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const [registerOption, deregisterOption, optionList] =
        useComponentRegistration<Option>();

    const getIndexOfOption = useCallback(
        (option: Option) => {
            for (let i = 0; i < optionList.length; i++) {
                if (optionList[i].element === option.element) {
                    return i;
                }
            }

            return -1;
        },
        [optionList]
    );

    const getFirstOption = useCallback((): Option | null => {
        if (optionList.length > 0) {
            return optionList[0];
        }

        return null;
    }, [optionList]);

    const getLastOption = useCallback((): Option | null => {
        if (optionList.length > 0) {
            return optionList[optionList.length - 1];
        }

        return null;
    }, [optionList]);

    const getNextOption = useCallback((): Option | null => {
        if (activeOption === null) {
            return getFirstOption();
        }

        const indexOfCurrentOption = activeOption
            ? getIndexOfOption(activeOption)
            : -1;

        if (indexOfCurrentOption === optionList.length - 1) {
            return activeOption;
        }

        return optionList[indexOfCurrentOption + 1];
    }, [getFirstOption, activeOption, getIndexOfOption, optionList]);

    const getPreviousOption = useCallback((): Option | null => {
        if (activeOption === null) {
            return getLastOption();
        }

        const indexOfCurrentOption = activeOption
            ? getIndexOfOption(activeOption)
            : optionList.length - 1;

        if (indexOfCurrentOption === 0) {
            return activeOption;
        }

        return optionList[indexOfCurrentOption - 1];
    }, [getLastOption, activeOption, getIndexOfOption, optionList]);

    return (
        <StyledListbox
            role="listbox"
            tabIndex={0}
            aria-activedescendant={activeOption?.element?.id}
            ref={listboxRef}
            onKeyDown={(evt) => {
                switch (evt.key) {
                    case "ArrowUp": {
                        setActiveOption(getPreviousOption());
                        break;
                    }
                    case "ArrowDown": {
                        setActiveOption(getNextOption());
                        break;
                    }
                    case "Home": {
                        setActiveOption(getFirstOption());
                        break;
                    }
                    case "End": {
                        setActiveOption(getLastOption());
                        break;
                    }
                    case " ":
                    case "Enter": {
                        setSelectedOption(activeOption);
                    }
                }
            }}
            onBlur={() => {
                setActiveOption(null);
            }}
        >
            <ListboxContext.Provider
                value={{
                    registerOption,
                    deregisterOption,
                    activeOption,
                    onActiveOptionChange: setActiveOption,
                    selectedOption,
                    onSelectedOptionChange: setSelectedOption,
                }}
            >
                {children}
            </ListboxContext.Provider>
        </StyledListbox>
    );
};

export default Listbox;
