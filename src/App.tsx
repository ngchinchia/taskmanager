import React, { FC, ReactElement } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { customTheme } from "./theme/customTheme";
import { Dashboard } from "./pages/dashboard/dashboard";
/* Calls app as type functional component and return a jsx constructor */
const App: FC = (): ReactElement => {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline/>
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
