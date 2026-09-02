import Box from "@mui/material/Box";

export default function TabPanel(props) {
  const { children, value, selected, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== selected}
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
      {...other}
    >
      <Box sx={{ pt: 3, pb: 3 }}>{children}</Box>
    </div>
  );
}
