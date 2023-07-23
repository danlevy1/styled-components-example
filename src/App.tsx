import React, { StrictMode } from "react";
import Listbox from "./components/Dropdown/Listbox";
import Option from "./components/Dropdown/Option";
import { ThemeProvider } from "styled-components";
import defaultTheme from "./defaultTheme";
import GlobalStyles from "./globalStyles";

const App = () => {
    return (
        <StrictMode>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles />
                <h1>LISTBOX COMPONENT</h1>
                <div style={{ margin: "30px 0 0 30px" }}>
                    <Listbox>
                        <Option text="Option 1" />
                        <Option text="Option 2" />
                        <Option text="Option 3" />
                        <Option text="Option 4" />
                    </Listbox>
                </div>
            </ThemeProvider>
        </StrictMode>
    );
};

export default App;
