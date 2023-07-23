import { Dispatch, SetStateAction, createContext } from "react";
import { Option } from "./Option";
import useComponentRegistration from "./useComponentRegistration";

type ListboxContextType = {
    registerOption: ReturnType<typeof useComponentRegistration<Option>>[0];
    deregisterOption: ReturnType<typeof useComponentRegistration<Option>>[1];
    activeOption: Option | null;
    onActiveOptionChange: Dispatch<SetStateAction<Option | null>>;
    selectedOption: Option | null;
    onSelectedOptionChange: Dispatch<SetStateAction<Option | null>>;
};

export const ListboxContext = createContext<ListboxContextType>({
    registerOption: () => undefined,
    deregisterOption: () => undefined,
    activeOption: null,
    onActiveOptionChange: () => {},
    selectedOption: null,
    onSelectedOptionChange: () => {},
});
