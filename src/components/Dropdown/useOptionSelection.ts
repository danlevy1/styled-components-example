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
    const [activeOption, setActiveOption] = useState<Option | null>(null);

    const registerOption = useCallback((newOption: Option): undefined => {
        setOptionList((currentOptionList) => [...currentOptionList, newOption]);
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
                    activeOption?.makeOptionInactive();
                    const previousOption = getPreviousOption();
                    previousOption?.makeOptionActive();
                    setActiveOption(previousOption);
                    break;
                }
                case "ArrowDown": {
                    activeOption?.makeOptionInactive();
                    const nextOption = getNextOption();
                    nextOption?.makeOptionActive();
                    setActiveOption(nextOption);
                    break;
                }
                case "Home": {
                    activeOption?.makeOptionInactive();
                    const firstOption = getFirstOption();
                    firstOption?.makeOptionActive();
                    setActiveOption(firstOption);
                    break;
                }
                case "End": {
                    activeOption?.makeOptionInactive();
                    const lastOption = getLastOption();
                    lastOption?.makeOptionActive();
                    setActiveOption(lastOption);
                    break;
                }
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
        listboxElement,
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

        optionList.forEach((option) => {
            option.element.addEventListener(
                "mousedown",
                handleMousedown(option)
            );
        });

        return () => {
            optionList.forEach((option) => {
                option.element.removeEventListener(
                    "mousedown",
                    handleMousedown(option)
                );
            });
        };
    }, [listboxElement, optionList, activeOption]);

    return { optionList, activeOption, registerOption, deregisterOption };
};

export default useOptionSelection;
