import { Dispatch, SetStateAction, createContext } from "react";
import { ListboxOption } from "./ListboxOption";
import useComponentRegistration from "./useComponentRegistration";

type ListboxContextType = {
    registerOption: ReturnType<
        typeof useComponentRegistration<ListboxOption>
    >[0];
    deregisterOption: ReturnType<
        typeof useComponentRegistration<ListboxOption>
    >[1];
    activeOption: ListboxOption | null;
    onActiveOptionChange: Dispatch<SetStateAction<ListboxOption | null>>;
    selectedOptions: ListboxOption[] | null;
    onSelectedOptionsChange: Dispatch<SetStateAction<ListboxOption[] | null>>;
    multiselect: boolean;
};

export const ListboxContext = createContext<ListboxContextType>({
    registerOption: () => undefined,
    deregisterOption: () => undefined,
    activeOption: null,
    onActiveOptionChange: () => {},
    selectedOptions: null,
    onSelectedOptionsChange: () => {},
    multiselect: false,
});
