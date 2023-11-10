import React, {
    CSSProperties,
    Children,
    ReactElement,
    ReactNode,
    cloneElement,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { ListboxOptionProps } from "./ListboxOption";
import { ListboxGroupProps } from "./ListboxGroup";

interface VirtualizedListProps {
    children?: ReactNode;
}

interface VirtualizedListItemProps {
    componentToRender: ReactElement;
    style: CSSProperties;
    index: number;
    setHeight: (index: number, height: number) => void;
}

const VirtualizedListItem = ({
    componentToRender,
    style,
    index,
    setHeight,
}: VirtualizedListItemProps) => {
    const [containerElement, setContainerElement] =
        useState<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (containerElement) {
            setHeight(index, containerElement.getBoundingClientRect().height);
        }
    }, [index, containerElement, setHeight]);

    const clonedComponentToRender = cloneElement<
        ListboxOptionProps | ListboxGroupProps
    >(componentToRender, {
        private_windowingRef: (node) => setContainerElement(node),
        private_windowingStyles: style,
    });

    return clonedComponentToRender;
};

export const VirtualizedList = ({ children }: VirtualizedListProps) => {
    const flattenedChildrenArray = useMemo(() => {
        return (Children.toArray(children) as ReactElement[]).flatMap(
            (child) => [
                cloneElement(child, {}, undefined),
                ...Children.toArray(child.props?.children),
            ]
        ) as ReactElement[];
    }, [children]);

    console.log(flattenedChildrenArray);

    const listRef = useRef<VariableSizeList | null>(null);
    const itemHeights = useRef<(number | null)[]>(
        new Array(flattenedChildrenArray.length).fill(null)
    );

    const setListItemHeight = useCallback(
        (index: number, height: number): undefined => {
            listRef.current?.resetAfterIndex(0);
            itemHeights.current[index] = height;
        },
        []
    );

    return (
        <AutoSizer style={{ width: "100%", height: "100%" }}>
            {({ width, height }) => (
                <VariableSizeList
                    width={width}
                    height={height}
                    itemCount={flattenedChildrenArray.length}
                    itemSize={(index) => itemHeights.current[index]}
                    ref={listRef}
                >
                    {({
                        index,
                        style,
                    }: {
                        index: number;
                        style: CSSProperties;
                    }) => (
                        <VirtualizedListItem
                            componentToRender={flattenedChildrenArray[index]}
                            style={style}
                            index={index}
                            setHeight={setListItemHeight}
                        />
                    )}
                </VariableSizeList>
            )}
        </AutoSizer>
    );
};
