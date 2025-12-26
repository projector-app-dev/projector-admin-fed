import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/uk";
import type { CustomDataPickerType } from "./CustomDataPicker.type";

const CustomDataPicker = (props: CustomDataPickerType) => {
  return (
    <LocalizationProvider adapterLocale="uk" dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ mb: 2 , width: "100%"}}
        value={props.value}
        onChange={props.setValue}
        label={props.label}
      />
    </LocalizationProvider>
  );
};

export default CustomDataPicker;
