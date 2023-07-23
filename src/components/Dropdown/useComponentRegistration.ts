import { useCallback, useState } from "react";

const useComponentRegistration = <
    T extends { element: HTMLElement | null }
>(): [typeof registerComponent, typeof deregisterComponent, T[]] => {
    const [componentList, setComponentList] = useState<T[]>([]);

    const registerComponent = useCallback((newComponent: T): undefined => {
        setComponentList((currentComponentList) => {
            if (currentComponentList.length === 0) {
                return [newComponent];
            } else {
                const newComponentList: T[] = [];

                let isNewComponentAddedToList = false;
                for (const currentComponent of currentComponentList) {
                    if (
                        !isNewComponentAddedToList &&
                        newComponent.element &&
                        currentComponent.element &&
                        newComponent.element.compareDocumentPosition(
                            currentComponent.element
                        ) & Node.DOCUMENT_POSITION_FOLLOWING
                    ) {
                        newComponentList.push(newComponent);
                        isNewComponentAddedToList = true;
                    }

                    newComponentList.push(currentComponent);
                }

                if (!isNewComponentAddedToList) {
                    newComponentList.push(newComponent);
                }

                return newComponentList;
            }
        });
    }, []);

    const deregisterComponent = useCallback((oldComponent: T): undefined => {
        setComponentList((currentComponentList) =>
            currentComponentList.filter((component) => {
                return component.element !== oldComponent.element;
            })
        );
    }, []);

    return [registerComponent, deregisterComponent, componentList];
};

export default useComponentRegistration;
