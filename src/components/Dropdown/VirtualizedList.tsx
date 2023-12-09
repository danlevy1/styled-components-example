import React, {
    CSSProperties,
    Children,
    ReactElement,
    ReactNode,
    cloneElement,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import { ListboxOptionProps } from "./ListboxOption";
import { ListboxGroupProps } from "./ListboxGroup";

interface VirtualizedListProps {
    children: ReactNode;
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

const VirtualizedListItemRenderer = ({
    index,
    style,
    data,
}: {
    index: number;
    style: CSSProperties;
    data: {
        childrenComponents: ReactElement[];
        setHeight: (index: number, height: number) => undefined;
    };
}) => {
    return (
        <VirtualizedListItem
            componentToRender={data.childrenComponents[index]}
            style={style}
            index={index}
            setHeight={data.setHeight}
        />
    );
};

export const VirtualizedList = ({ children }: VirtualizedListProps) => {
    const numChildren = Children.count(children);

    const listRef = useRef<VariableSizeList | null>(null);
    const itemHeights = useRef<(number | null)[]>(
        new Array(numChildren).fill(null)
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
            {({ width, height }) =>
                Array.isArray(children) ? (
                    <VariableSizeList
                        width={width}
                        height={height}
                        itemCount={numChildren}
                        itemSize={(index) => itemHeights.current[index]}
                        itemData={{
                            childrenComponents: children,
                            setHeight: setListItemHeight,
                        }}
                        ref={listRef}
                    >
                        {VirtualizedListItemRenderer}
                    </VariableSizeList>
                ) : null
            }
        </AutoSizer>
    );
};
