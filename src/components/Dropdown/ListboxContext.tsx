import { Dispatch, SetStateAction, createContext } from "react";

type ListboxContextType = {
    activeOptionValue: string | null;
    onActiveOptionValueChange: Dispatch<SetStateAction<string | null>>;
    selectedOptionValues: string[];
    onSelectedOptionValuesChange: Dispatch<SetStateAction<string[]>>;
    multiselect: boolean;
};

export const ListboxContext = createContext<ListboxContextType>({
    activeOptionValue: null,
    onActiveOptionValueChange: () => {},
    selectedOptionValues: [],
    onSelectedOptionValuesChange: () => {},
    multiselect: false,
});
