import "aos/dist/aos.css";
import AOS from "aos";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
////
import Settings from "./components/settings";
import { ProgressBarStyle } from "./components/ProgressBar";
import NotistackProvider from "./components/NotistackProvider";
import ThemeColorPresets from "./components/ThemeColorPresets";
import ThemeLocalization from "./components/ThemeLocalization";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "./features/globalSlice";
import { setTemplate } from "./features/templateSlice";
import db from "./firebase";
import firebase from "firebase/compat";

const LoadingScreenCustom = lazy(() =>
  import("./components/LoadingScreenCustom")
);
const GlobalMessage = lazy(() =>
  import("./components/global-message/GlobalMessage")
);
// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();

  const temp_getTemplateRef = useRef();

  const [ownerTemplate, setOwnerTemplate] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    temp_getTemplateRef.current();
  }, []);

  async function getTemplate() {
    dispatch(setLoading(true));

    await db
      .collection("template")
      .doc("template")
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          setOwnerTemplate(doc?.data()?.template);
          dispatch(setTemplate(doc?.data()?.template));
          dispatch(setLoading(false));
        } else {
          await db.collection("log").add({
            logType: "template retrieval",
            message: "No document template found",
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          });

          setOwnerTemplate("");
          dispatch(setTemplate(""));

          dispatch(setLoading(false));
        }
      })
      .catch(async (error) => {
        await db.collection("log").add({
          logType: "template retrieval",
          message: error?.message,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        });

        setOwnerTemplate("");
        dispatch(setTemplate(""));

        dispatch(setLoading(false));
      });
  }

  temp_getTemplateRef.current = getTemplate;

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <NotistackProvider>
            <MotionLazyContainer>
              <ProgressBarStyle />
              {ownerTemplate !== "carrentalatish" ? <Settings /> : <></>}
              <Suspense fallback={<></>}>
                <LoadingScreenCustom />
              </Suspense>
              <Suspense fallback={<></>}>
                <GlobalMessage />
              </Suspense>
              <Router ownerTemplate={ownerTemplate} />
            </MotionLazyContainer>
          </NotistackProvider>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
