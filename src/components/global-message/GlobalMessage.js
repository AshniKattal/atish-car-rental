import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRegister } from "src/features/registerSlice";

export default function GlobalMessage() {
  const { message } = useSelector(selectRegister);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (message?.message && message?.variant) {
      enqueueSnackbar(message?.message, { variant: message?.variant });
    }
  }, [message]);

  return <></>;
}
