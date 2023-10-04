import React, { StrictMode, useState } from "react";
import Listbox from "./components/Dropdown/Listbox";
import ListboxOption from "./components/Dropdown/ListboxOption";
import { ListboxGroup } from "./components/Dropdown/ListboxGroup";
import { ThemeProvider } from "styled-components";
import defaultTheme from "./defaultTheme";
import GlobalStyles from "./globalStyles";

const ListboxExample = () => {
    const [value, onChange] = useState<string[]>([]);

    return (
        <>
            <h1>LISTBOX COMPONENT</h1>
            <div id="ex">example description</div>
            <div>Selected Values: {JSON.stringify(value)}</div>
            <div style={{ margin: "30px 0 0 30px" }}>
                <Listbox
                    aria-label="example label"
                    aria-describedby="ex"
                    // multiselect
                    // selectionFollowsFocus
                    value={value}
                    onChange={onChange}
                >
                    <ListboxGroup text="Group 1">
                        <ListboxOption text="Option 1" value="value-1" />
                        <ListboxOption text="Option 2" value="value-2" />
                    </ListboxGroup>
                    <ListboxGroup text="Group 2">
                        <ListboxOption text="Option 3" value="value-3" />
                        <ListboxOption text="Option 4" value="value-4" />
                    </ListboxGroup>
                </Listbox>
            </div>
        </>
    );
};

const App = () => {
    return (
        <StrictMode>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles />
                <ListboxExample />
            </ThemeProvider>
        </StrictMode>
    );
};

export default App;
