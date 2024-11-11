import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
//
import { FIREBASE_API } from "../config";
import db, { auth, functions } from "../firebase";
import firebase from "firebase/compat";
import LoadingScreenNormal from "../components/LoadingScreenNormal";
import { setResetAdmin } from "../features/adminSlice";
import { resetCompany, setCompanyList } from "../features/companySlice";
import { resetGlobal } from "../features/globalSlice";
import { resetInvoiceSection } from "../features/invoiceSectionSlice";
import { resetMember } from "../features/memberSlice";
import { resetPaymentSection } from "../features/paymentSectionSlice";
import { resetProfile } from "../features/profileSlice";
import { resetReportSection } from "../features/reportSectionSlice";
import { resetSnackbar } from "../features/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { dynamicSort } from "src/components/core-functions/SelectionCoreFunctions";
import { selectTemplate } from "src/features/templateSlice";
import {
  selectRegister,
  setMessage,
  setOpenDialog,
} from "src/features/registerSlice";
import { selectBooking, setBookingData } from "src/features/bookingSlice";
import { firstName } from "src/_mock/name";
import {
  getNewBookingId,
  notifyByEmailAfterNewBooking,
  saveNewBooking,
} from "src/components/core-functions/CoreFunctions";
// import { getMraToken } from "../components/core-functions/MraCoreFunctions";

// ----------------------------------------------------------------------

// const ADMIN_EMAILS = ["demo@minimals.cc"];

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === "INITIALISE") {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: "firebase",
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const dispatchAction = useDispatch();

  const { bookingData } = useSelector(selectBooking);

  const { callLocation } = useSelector(selectRegister);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(false);

  const getAllCompanies = useCallback(
    async (userId, a_comp, role) => {
      await db
        .collection("company")
        .get()
        .then((result) => {
          if (result?.docs && result?.docs?.length > 0) {
            let newCompanyList = [];
            result?.docs.forEach((doc) => {
              /*     if (
                (doc.id !== "companyIds" &&
                  doc.id !== process.env.REACT_APP_PROTECTED_COMPANY) ||
                (doc.id !== "companyIds" &&
                  doc.id === process.env.REACT_APP_PROTECTED_COMPANY &&
                  userId === process.env.REACT_APP_PROTECTED_USER)
              ) { */
              if (
                (role === "super-admin" ||
                  (a_comp &&
                    a_comp?.length > 0 &&
                    a_comp.find((company) => company.id === doc.id))) &&
                doc?.id !== "companyIds"
              ) {
                newCompanyList.push({
                  id: doc.id,
                  name: doc.data().name,
                  data: { ...doc.data() },
                });
              }
              // }
            });

            newCompanyList.sort(dynamicSort("name"));

            dispatchAction(setCompanyList(newCompanyList));
          } else {
            dispatchAction(setCompanyList([]));
          }
        });
    },
    [dispatchAction]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, async (user) => {
      setLoading(true);
      if (user) {
        // for client only -> pass a_comp
        let clientAComp = [
          {
            id: process.env.REACT_APP_COMPANY_ID || "",
            name: process.env.REACT_APP_COMPANY_NAME || "",
          },
        ];

        const isValid = functions.httpsCallable("checkusertype");
        isValid({ userId: user.uid, a_comp: JSON.stringify(clientAComp) })
          .then(async (result) => {
            if (result.data.success) {
              let permissions = await getPermissions(user.uid);
              await getAllCompanies(
                user.uid,
                result?.data?.a_comp,
                result.data.result
              );

              dispatch({
                type: "INITIALISE",
                payload: {
                  isAuthenticated: true,
                  user: {
                    ...user,
                    permissions: permissions,
                    role: result.data.result,
                    a_comp: result?.data?.a_comp || [],
                    ebs_encrypt_key:
                      result.data?.responseToken?.aesKeyBase64 || "",
                    ebs_mra_key: result.data?.responseToken?.key || "",
                    ebs_mra_token: result.data?.responseToken?.token || "",
                    ebs_mra_token_expiryDate:
                      result.data?.responseToken?.expiryDate || "",
                  },
                },
              });
              setLoading(false);
            } else {
              dispatch({
                type: "INITIALISE",
                payload: { isAuthenticated: false, user: null },
              });
              setLoading(false);
              resetAll();
              // enqueueSnackbar("You don't have access to this site. Please contact an admin.", { variant: 'error' });
              auth.signOut();
            }
          })
          .catch(() => {
            dispatch({
              type: "INITIALISE",
              payload: { isAuthenticated: false, user: null },
            });
            setLoading(false);
            resetAll();
            auth.signOut();
          });
        //}
      } else {
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: false, user: null },
        });
        resetAll();
        auth.signOut();
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [dispatch, getAllCompanies]);

  /*   useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        setLoading(true);
        if (user) {
          const isValid = functions.httpsCallable("checkusertype");
          isValid({ userId: user.uid })
            .then(async (result) => {
              if (result.data.success) {
                let permissions = await getPermissions(user.uid);
                await getAllCompanies(
                  user.uid,
                  result?.data?.a_comp,
                  result.data.result
                );

                console.log(
                  "responseToken: ",
                  result.data?.responseToken?.token
                );

                dispatch({
                  type: "INITIALISE",
                  payload: {
                    isAuthenticated: true,
                    user: {
                      ...user,
                      permissions: permissions,
                      role: result.data.result,
                      a_comp: result?.data?.a_comp || [],
                      ebs_mra_token_key: result.data?.responseToken?.key || "",
                      ebs_mra_token: result.data?.responseToken?.token || "",
                      ebs_mra_token_expiryDate:
                        result.data?.responseToken?.expiryDate || "",
                    },
                  },
                });
                setLoading(false);
              } else {
                dispatch({
                  type: "INITIALISE",
                  payload: { isAuthenticated: false, user: null },
                });
                setLoading(false);
                resetAll();
                // enqueueSnackbar("You don't have access to this site. Please contact an admin.", { variant: 'error' });
                auth.signOut();
              }
            })
            .catch(() => {
              dispatch({
                type: "INITIALISE",
                payload: { isAuthenticated: false, user: null },
              });
              setLoading(false);
              resetAll();
              auth.signOut();
            });
        } else {
          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: false, user: null },
          });
          resetAll();
          auth.signOut();
          setLoading(false);
        }
      }),
    [dispatch]
  ); */

  const getPermissions = async (uid) =>
    new Promise((resolve) => {
      //if (role !== 'member') {
      db.collection("users")
        .doc(uid)
        .onSnapshot((doc) => {
          let perObj = {};
          let arr = doc?.data()?.sysFunc || [];
          if (arr && arr.length > 0) {
            arr.forEach((permission) => {
              perObj = {
                ...perObj,
                [permission.name]: {
                  checked: permission[permission.name] || false,
                  assignedCompanyId: permission?.assignedCompanyId || [],
                },
              };
            });
          }
          setProfile(doc.data());
          resolve(perObj);
        });
      //} else {
      //resolve([]);
      //}
    });

  function resetAll() {
    dispatch(setResetAdmin());
    dispatch(resetCompany());
    dispatch(resetGlobal());
    dispatch(resetInvoiceSection());
    dispatch(resetMember());
    dispatch(resetPaymentSection());
    dispatch(resetProfile());
    dispatch(resetReportSection());
    dispatch(resetSnackbar());
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(AUTH, email, password);

  const register = async (userDetail) => {
    await createUserWithEmailAndPassword(
      AUTH,
      userDetail?.email,
      userDetail?.password
    )
      .then(async (res) => {
        await db
          .collection("users")
          .doc(res.user?.uid)
          .set(
            {
              uid: res.user?.uid,
              id: res.user?.uid,
              displayName: `${userDetail?.firstName || ""} ${
                userDetail?.lastName || ""
              }`,
              ...userDetail,
            },
            { merge: true }
          );

        if (callLocation === "confirmBooking") {
          await confirmBooking(
            res.user?.uid,
            userDetail?.firstName,
            userDetail?.lastName,
            userDetail?.email
          );
        } else {
          setLoading(false);

          dispatchAction(
            setMessage({
              message: "You have been registered successfully.",
              variant: "success",
            })
          );

          dispatchAction(setOpenDialog(false));
        }
      })
      .catch((error) => {
        dispatchAction(
          setMessage({ message: error?.message || "", variant: "error" })
        );
      });
  };

  async function confirmBooking(userId, firstName, lastName, email) {
    setLoading(true);

    let bookingIdResult = await getNewBookingId();

    if (bookingIdResult?.error) {
      dispatchAction(
        setMessage({
          message: bookingIdResult?.message,
          variant: "error",
        })
      );

      setLoading(false);
    } else if (!bookingIdResult?.error) {
      // no error
      let saveNewBookingResult = await saveNewBooking(
        bookingIdResult?.bookingId,
        bookingData?.product,
        bookingData,
        {
          id: userId,
          firstName: firstName,
          lastName: lastName,
        }
      );

      if (saveNewBookingResult?.error) {
        dispatchAction(
          setMessage({
            message: saveNewBookingResult?.message,
            variant: "error",
          })
        );

        setLoading(false);
      } else if (!saveNewBookingResult?.error) {
        // no error
        // notify client
        let clientNotificationResult = await notifyByEmailAfterNewBooking(
          bookingIdResult?.bookingId,
          `${lastName || ""} ${firstName || ""}`,
          email,
          bookingData,
          bookingData?.product?.name,
          "Booking recorded successfully.",
          "client",
          ""
        );

        if (clientNotificationResult?.error) {
          dispatchAction(
            setMessage({
              message: clientNotificationResult?.message,
              variant: "error",
            })
          );

          setLoading(false);
        } else if (!clientNotificationResult?.error) {
          // no error
          // notify admin
          let adminNotificationResult = await notifyByEmailAfterNewBooking(
            bookingIdResult?.bookingId,
            "Admin",
            process.env.REACT_APP_EMAIL,
            bookingData,
            bookingData?.product?.name,
            `Booking sent to admin successfully.`,
            "admin",
            `${lastName || ""} ${firstName || ""}`
          );

          if (adminNotificationResult?.error) {
            dispatchAction(
              setMessage({
                message: adminNotificationResult?.message,
                variant: "error",
              })
            );

            setLoading(false);
          } else if (!adminNotificationResult?.error) {
            // no error
            dispatchAction(
              setMessage({
                message: clientNotificationResult?.message,
                variant: "success",
              })
            );

            dispatchAction(
              setMessage({
                message: adminNotificationResult?.message,
                variant: "success",
              })
            );

            dispatchAction(
              setBookingData({
                bookingPickupAddress: null,
                bookingPickupAnywhereAddress: "",
                bookingPickupDate: new Date(),
                bookingPickupTime: "00:00",
                bookingReturnDate: new Date(),
                bookingReturnTime: "00:00",
                bookingNumberOfDays: 0,
                bookingBabySeatQty: 0,
                bookingBoosterSeatQty: 0,
                bookingChildSeatQty: 0,
                bookingTotalAmount: 0,
              })
            );

            setLoading(false);

            // Wait for 2 seconds, then call myFunction
            setTimeout(() => {
              redirectToDashboard();
            }, 3000);
          }
        }
      }
    }
  }

  function redirectToDashboard() {
    window.location.href = "/dashboard/app1";

    setLoading(false);
  }

  const logout = () => signOut(AUTH);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "firebase",
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          role: state?.user?.role,
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || "",
          country: profile?.country || "",
          address: profile?.address || "",
          state: profile?.state || "",
          city: profile?.city || "",
          zipCode: profile?.zipCode || "",
          about: profile?.about || "",
          isPublic: profile?.isPublic || false,
          a_comp: state?.user?.a_comp || [],
          permissions: state?.user?.permissions,
        },
        login,
        register,
        logout,
      }}
    >
      {loading ? <LoadingScreenNormal /> : ""}
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
