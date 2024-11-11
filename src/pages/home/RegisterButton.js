import "animate.css";
import { Button } from "@mui/material";
import { useState } from "react";
import Iconify from "../../components/Iconify";
import RegistrationForm from "./registrationDialog/RegistrationDialog";
import backgroundImage from "./features/images/background11.png";
import { useDispatch, useSelector } from "react-redux";
import { selectRegister, setOpenDialog } from "src/features/registerSlice";

export default function RegisterButton({ home, header }) {
  const dispatch = useDispatch();

  const { openDialog } = useSelector(selectRegister);

  return (
    <>
      <Button
        className={
          header
            ? "animate__animated animate__fadeIn animate__delay-1s"
            : "animate__animated animate__fadeInUp animate__delay-2s"
        }
        variant={"contained"}
        startIcon={
          header ? undefined : (
            <Iconify icon={"line-md:uploading-loop"} width={35} height={35} />
          )
        }
        // color="primary"
        onClick={() => dispatch(setOpenDialog(true))}
        style={{
          zIndex: 1000,
          width: home ? 300 : undefined,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 10%",
        }}
        size="large"
      >
        {header ? "Register" : "Register now"}
      </Button>

      {openDialog ? <RegistrationForm open={openDialog} /> : <></>}
    </>
  );
}
