import { useCallback, useEffect, useState } from "react";
import { Option } from "./Option";

const getIndexOfOption = (list: Option[], option: Option) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].element === option.element) {
            return i;
        }
    }

    return -1;
};

const useOptionSelection = (listboxElement: HTMLUListElement | null) => {
    const [optionList, setOptionList] = useState<Option[]>([]);
    const [activeOption, setActiveOption_do_not_use] = useState<Option | null>(
        null
    );
    const [selectedOption, setSelectedOption_do_not_use] =
        useState<Option | null>(null);

    const setActiveOption = useCallback(
        (newActiveOption: Option | null) => {
            activeOption?.makeOptionInactive();
            newActiveOption?.makeOptionActive();

            setActiveOption_do_not_use(newActiveOption);
        },
        [activeOption]
    );

    const setSelectedOption = useCallback(
        (newSelectedOption: Option | null) => {
            selectedOption?.deselectOption();
            newSelectedOption?.selectOption();

            setSelectedOption_do_not_use(newSelectedOption);
        },
        [selectedOption]
    );

    const registerOption = useCallback((newOption: Option): undefined => {
        setOptionList((currentOptionList) => {
            if (currentOptionList.length === 0) {
                return [newOption];
            } else {
                const newOptionList: Option[] = [];

                let isNewOptionAddedToList = false;
                for (const currentOption of currentOptionList) {
                    if (
                        !isNewOptionAddedToList &&
                        newOption.element.compareDocumentPosition(
                            currentOption.element
                        ) & Node.DOCUMENT_POSITION_FOLLOWING
                    ) {
                        newOptionList.push(newOption);
                        isNewOptionAddedToList = true;
                    }

                    newOptionList.push(currentOption);
                }

                if (!isNewOptionAddedToList) {
                    newOptionList.push(newOption);
                }

                return newOptionList;
            }
        });
    }, []);

    const deregisterOption = useCallback(
        (oldOptionElement: Element): undefined => {
            setOptionList((currentOptionList) =>
                currentOptionList.filter((option) => {
                    return option.element !== oldOptionElement;
                })
            );
        },
        []
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
            ? getIndexOfOption(optionList, activeOption)
            : -1;

        if (indexOfCurrentOption === optionList.length - 1) {
            return activeOption;
        }

        return optionList[indexOfCurrentOption + 1];
    }, [getFirstOption, activeOption, optionList]);

    const getPreviousOption = useCallback((): Option | null => {
        if (activeOption === null) {
            return getLastOption();
        }

        const indexOfCurrentOption = activeOption
            ? getIndexOfOption(optionList, activeOption)
            : optionList.length - 1;

        if (indexOfCurrentOption === 0) {
            return activeOption;
        }

        return optionList[indexOfCurrentOption - 1];
    }, [getLastOption, activeOption, optionList]);

    useEffect(() => {
        const handleKeydown = (evt: KeyboardEvent) => {
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
                case "Enter":
                case " ":
                    setSelectedOption(activeOption);
                    break;
            }
        };

        listboxElement?.addEventListener("keydown", handleKeydown);

        return () => {
            listboxElement?.removeEventListener("keydown", handleKeydown);
        };
    }, [
        getPreviousOption,
        getNextOption,
        getFirstOption,
        getLastOption,
        setActiveOption,
        activeOption,
        selectedOption,
        listboxElement,
        setSelectedOption,
    ]);

    useEffect(() => {
        const handleMousedown = (option: Option) => {
            const handleMousedownCurried = () => {
                activeOption?.makeOptionInactive();
                option.makeOptionActive();
                setActiveOption(option);
            };

            return handleMousedownCurried;
        };

        const handleMouseup = (option: Option) => {
            const handleMouseupCurried = () => {
                setSelectedOption(option);
            };

            return handleMouseupCurried;
        };

        const handleMouseleave = (option: Option) => {
            const handleMouseleaveCurried = (evt: MouseEvent) => {
                if (evt.buttons === 1 && option !== selectedOption) {
                    setActiveOption(null);
                }
            };

            return handleMouseleaveCurried;
        };

        const eventListeners: {
            handleMemoizedMousedown: () => void;
            handleMemoizedMouseup: () => void;
            handleMemoizedMouseleave: (evt: MouseEvent) => void;
        }[] = [];

        optionList.forEach((option, i) => {
            const mousedownCurried = handleMousedown(option);
            const mouseupCurried = handleMouseup(option);
            const mouseleaveCurried = handleMouseleave(option);

            eventListeners.push({
                handleMemoizedMousedown: mousedownCurried,
                handleMemoizedMouseup: mouseupCurried,
                handleMemoizedMouseleave: mouseleaveCurried,
            });

            option.element.addEventListener(
                "mousedown",
                eventListeners[i].handleMemoizedMousedown
            );
            option.element.addEventListener(
                "mouseup",
                eventListeners[i].handleMemoizedMouseup
            );
            option.element.addEventListener(
                "mouseleave",
                eventListeners[i].handleMemoizedMouseleave
            );
        });

        return () => {
            optionList.forEach((option, i) => {
                option.element.removeEventListener(
                    "mousedown",
                    eventListeners[i].handleMemoizedMousedown
                );
                option.element.removeEventListener(
                    "mouseup",
                    eventListeners[i].handleMemoizedMouseup
                );
                option.element.removeEventListener(
                    "mouseleave",
                    eventListeners[i].handleMemoizedMouseleave
                );
            });
        };
    }, [
        listboxElement,
        optionList,
        activeOption,
        selectedOption,
        setActiveOption,
        setSelectedOption,
    ]);

    useEffect(() => {
        const handleFocusout = () => {
            setActiveOption(null);
        };

        listboxElement?.addEventListener("focusout", handleFocusout);

        return () => {
            listboxElement?.removeEventListener("focusout", handleFocusout);
        };
    }, [activeOption, listboxElement, setActiveOption]);

    return {
        optionList,
        activeOption,
        selectedOption,
        registerOption,
        deregisterOption,
    };
};

export default useOptionSelection;
