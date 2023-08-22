import React, { StrictMode } from "react";
import Listbox from "./components/Dropdown/Listbox";
import ListboxOption from "./components/Dropdown/ListboxOption";
import { ListboxGroup } from "./components/Dropdown/ListboxGroup";
import { ThemeProvider } from "styled-components";
import defaultTheme from "./defaultTheme";
import GlobalStyles from "./globalStyles";

const App = () => {
    return (
        <StrictMode>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles />
                <h1>LISTBOX COMPONENT</h1>
                <span id="ex">example description</span>
                <div style={{ margin: "30px 0 0 30px" }}>
                    <Listbox
                        aria-label="example label"
                        aria-describedby="ex"
                        multiselect
                    >
                        <ListboxGroup text="Group 1">
                            <ListboxOption text="Option 1" />
                            <ListboxOption text="Option 2" />
                        </ListboxGroup>
                        <ListboxGroup text="Group 2">
                            <ListboxOption text="Option 3" />
                            <ListboxOption text="Option 4" />
                        </ListboxGroup>
                    </Listbox>
                </div>
            </ThemeProvider>
        </StrictMode>
    );
};

export default App;
