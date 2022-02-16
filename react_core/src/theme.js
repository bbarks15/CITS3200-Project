import { createMuiTheme, responsiveFontSizes  } from "@material-ui/core/styles";

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: { main: "#0a70b4" },
    secondary: { main: "#ffffff" },
    // text: {primary: "#0a70b4"}
  },
  typography: {
    h6: {
      fontSize: 16,
    }
  }
}));
export default theme;
