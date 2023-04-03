import React from "react";
import Button from "./components/Button/Button";
import Iframe from "./components/Iframe/Iframe";
import { ThemeProvider } from "styled-components";
import theme from "./theme";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Button>Test Button</Button>
            <Iframe srcDoc="<span>Test Text</span>" />
        </ThemeProvider>
    );
};

export default App;
