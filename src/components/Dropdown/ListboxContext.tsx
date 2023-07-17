import { createContext } from "react";
import { Option } from "./Option";

type ListboxContextType = {
    registerOption: (newOption: Option) => undefined;
    deregisterOption: (oldOptionElement: Element) => undefined;
};

export const ListboxContext = createContext<ListboxContextType>({
    registerOption: () => undefined,
    deregisterOption: () => undefined,
});
