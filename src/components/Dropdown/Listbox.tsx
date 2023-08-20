import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { ListboxContext } from "./ListboxContext";
import useComponentRegistration from "./useComponentRegistration";
import { ListboxOption } from "./ListboxOption";

type ListboxDiscriminatedProps =
    | {
          "aria-label": string;
          "aria-labelledby"?: string;
      }
    | {
          "aria-label"?: string;
          "aria-labelledby": string;
      };

type ListboxNonDiscriminatedProps = {
    "aria-describedby"?: string;
    selectionFollowsFocus?: boolean;
    children?: ReactNode;
};

export type ListboxProps = ListboxDiscriminatedProps &
    ListboxNonDiscriminatedProps;

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

const Listbox = ({
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    selectionFollowsFocus = false,
    children,
}: ListboxProps) => {
    const listboxRef = useRef<HTMLUListElement>(null);
    const [activeOption, setActiveOption] = useState<ListboxOption | null>(
        null
    );
    const [selectedOption, setSelectedOption] = useState<ListboxOption | null>(
        null
    );

    const [registerOption, deregisterOption, optionList] =
        useComponentRegistration<ListboxOption>();

    const getIndexOfOption = useCallback(
        (option: ListboxOption) => {
            for (let i = 0; i < optionList.length; i++) {
                if (optionList[i].element === option.element) {
                    return i;
                }
            }

            return -1;
        },
        [optionList]
    );

    const getFirstOption = useCallback((): ListboxOption | null => {
        if (optionList.length > 0) {
            return optionList[0];
        }

        return null;
    }, [optionList]);

    const getLastOption = useCallback((): ListboxOption | null => {
        if (optionList.length > 0) {
            return optionList[optionList.length - 1];
        }

        return null;
    }, [optionList]);

    const getNextOption = useCallback((): ListboxOption | null => {
        const currentOption = activeOption ?? selectedOption;

        if (currentOption == null) {
            return getFirstOption();
        }

        const indexOfCurrentOption = currentOption
            ? getIndexOfOption(currentOption)
            : -1;

        if (indexOfCurrentOption === optionList.length - 1) {
            return currentOption;
        }

        return optionList[indexOfCurrentOption + 1];
    }, [
        getFirstOption,
        activeOption,
        selectedOption,
        getIndexOfOption,
        optionList,
    ]);

    const getPreviousOption = useCallback((): ListboxOption | null => {
        const currentOption = activeOption ?? selectedOption;

        if (currentOption == null) {
            return getLastOption();
        }

        const indexOfCurrentOption = currentOption
            ? getIndexOfOption(currentOption)
            : optionList.length - 1;

        if (indexOfCurrentOption === 0) {
            return currentOption;
        }

        return optionList[indexOfCurrentOption - 1];
    }, [
        getLastOption,
        activeOption,
        selectedOption,
        getIndexOfOption,
        optionList,
    ]);

    return (
        <StyledListbox
            role="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            tabIndex={0}
            aria-activedescendant={activeOption?.element?.id}
            ref={listboxRef}
            onKeyDown={(evt) => {
                switch (evt.key) {
                    case "ArrowUp": {
                        const previousOption = getPreviousOption();
                        setActiveOption(previousOption);
                        selectionFollowsFocus &&
                            setSelectedOption(previousOption);
                        break;
                    }
                    case "ArrowDown": {
                        const nextOption = getNextOption();
                        setActiveOption(nextOption);
                        selectionFollowsFocus && setSelectedOption(nextOption);
                        break;
                    }
                    case "Home": {
                        const firstOption = getFirstOption();
                        setActiveOption(firstOption);
                        selectionFollowsFocus && setSelectedOption(firstOption);
                        break;
                    }
                    case "End": {
                        const lastOption = getLastOption();
                        setActiveOption(lastOption);
                        selectionFollowsFocus && setSelectedOption(lastOption);
                        break;
                    }
                    case " ":
                    case "Enter": {
                        !selectionFollowsFocus &&
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
