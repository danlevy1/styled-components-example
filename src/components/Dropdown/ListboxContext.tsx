import { Dispatch, SetStateAction, createContext } from "react";
import { ListboxOptionData } from "./ListboxOption";
import useComponentRegistration from "./useComponentRegistration";

type ListboxContextType = {
    registerOption: ReturnType<
        typeof useComponentRegistration<ListboxOptionData>
    >[0];
    deregisterOption: ReturnType<
        typeof useComponentRegistration<ListboxOptionData>
    >[1];
    activeOption: ListboxOptionData | null;
    onActiveOptionChange: Dispatch<SetStateAction<ListboxOptionData | null>>;
    selectedOptionValues: string[];
    onSelectedOptionValuesChange: Dispatch<SetStateAction<string[]>>;
    multiselect: boolean;
};

export const ListboxContext = createContext<ListboxContextType>({
    registerOption: () => undefined,
    deregisterOption: () => undefined,
    activeOption: null,
    onActiveOptionChange: () => {},
    selectedOptionValues: [],
    onSelectedOptionValuesChange: () => {},
    multiselect: false,
});
