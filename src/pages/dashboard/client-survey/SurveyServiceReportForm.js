import {
  Autocomplete,
  Grid,
  TextField,
  Divider,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getDefaultCheckBoxOptions } from "src/components/core-functions/SelectionCoreFunctions";

export default function SurveyServiceReportForm({
  clientList,
  clientDocumentObjectSelected,
  setClientDocumentObjectSelected,
  setSurveyDetail,
  surveyDetail,
  dialogType,
  documentType,
}) {
  const temp_getOptionsRef = useRef();

  const [defaultCheckBoxOptions, setDefaultCheckBoxOptions] = useState(null);

  useEffect(() => {
    temp_getOptionsRef.current();
  }, []);

  async function getOptions() {
    let defaultOptions = await getDefaultCheckBoxOptions();

    if (defaultOptions) {
      setDefaultCheckBoxOptions(defaultOptions);
    }
  }

  temp_getOptionsRef.current = getOptions;

  return (
    <>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                name="surveyNumber"
                label="Survey number"
                id="surveyNumber"
                type="text"
                value={surveyDetail?.surveyNumber || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      surveyNumber: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid> */}

        <Grid item xs={12} md={4}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Please choose a client"
            id="client-drop-down"
            options={clientList || []}
            value={clientDocumentObjectSelected || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Please choose a client"
                size="large"
              />
            )}
            onChange={(e, value, reason) => {
              e.preventDefault();
              if (reason !== "removeOption" && reason !== "clear" && value) {
                let phoneText = "";
                if (value?.data?.contactNumber && value?.data?.mobileNumber) {
                  phoneText = `${value?.data?.contactNumber} / ${value?.data?.mobileNumber}`;
                } else {
                  phoneText =
                    value?.data?.contactNumber ||
                    value?.data?.mobileNumber ||
                    "";
                }

                setSurveyDetail((prev) => {
                  return {
                    ...prev,
                    customerName: value?.data?.name || "",
                    clientSigName: value?.data?.name || "",
                    address: value?.data?.address || "",
                    email: value?.data?.email || "",
                    phone: phoneText || "",
                  };
                });

                setClientDocumentObjectSelected(value);
              } else if (reason === "removeOption" || reason === "clear") {
                setSurveyDetail((prev) => {
                  return {
                    ...prev,
                    customerName: "",
                    clientSigName: "",
                    address: "",
                    email: "",
                    phone: "",
                  };
                });

                setClientDocumentObjectSelected(null);
              }
            }}
            getOptionLabel={(option) => option?.name || ""}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            variant="outlined"
            name="customerName"
            label="Customer"
            id="customerName"
            type="text"
            value={surveyDetail?.customerName || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  customerName: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            name="address"
            label="Address"
            id="address"
            type="text"
            value={surveyDetail?.address || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  address: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            name="email"
            label="Email"
            id="email"
            type="text"
            value={surveyDetail?.email || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  email: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            name="phone"
            label="Phone"
            id="phone"
            type="text"
            value={surveyDetail?.phone || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  phone: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        {documentType?.title === "Survey" ? (
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              name="time"
              label="Time"
              id="time"
              type="time"
              value={surveyDetail?.time || "00:00"}
              size="large"
              fullWidth
              onChange={(event) => {
                setSurveyDetail((previous) => {
                  return {
                    ...previous,
                    time: event.target.value,
                  };
                });
              }}
              disabled={dialogType === "view"}
            />
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  name="timeIn"
                  label="Time In"
                  id="timeIn"
                  type="time"
                  value={surveyDetail?.timeIn || "00:00"}
                  size="large"
                  fullWidth
                  onChange={(event) => {
                    setSurveyDetail((previous) => {
                      return {
                        ...previous,
                        timeIn: event.target.value,
                      };
                    });
                  }}
                  disabled={dialogType === "view"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  name="timeOut"
                  label="Time Out"
                  id="timeOut"
                  type="time"
                  value={surveyDetail?.timeOut || "00:00"}
                  size="large"
                  fullWidth
                  onChange={(event) => {
                    setSurveyDetail((previous) => {
                      return {
                        ...previous,
                        timeOut: event.target.value,
                      };
                    });
                  }}
                  disabled={dialogType === "view"}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} md={12}>
          <TextField
            variant="outlined"
            name="serviceCarriesAt"
            label="Service carries at"
            id="serviceCarriesAt"
            type="text"
            value={surveyDetail?.serviceCarriesAt || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  serviceCarriesAt: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
        </Grid>
        <Grid item xs={12} md={12} textAlign={"center"}>
          <Typography variant="h6">
            Please Tick the appropriate column
          </Typography>
        </Grid>
      </Grid>

      {documentType?.title === "Service Report" ? (
        <>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography>Routine: </Typography>
            </Grid>

            {defaultCheckBoxOptions?.routineCheckboxList &&
              defaultCheckBoxOptions?.routineCheckboxList?.length > 0 &&
              defaultCheckBoxOptions?.routineCheckboxList?.map(
                (control, index) => (
                  <Grid
                    item
                    xs={4}
                    md={2}
                    key={index}
                    sx={{
                      marginBottom: 0,
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiFormControlLabel-root": {
                          // marginRight: 10,
                          marginBottom: "0 !important",
                        },
                      }}
                      // value={surveyDetail?.controlOf[control.name] || false}
                      control={
                        <Checkbox
                          checked={surveyDetail?.routine[control.name] || false}
                          disabled={dialogType === "view"}
                          size="medium"
                          onChange={(e) =>
                            setSurveyDetail((prev) => {
                              return {
                                ...prev,
                                routine: {
                                  ...prev.routine,
                                  [control.name]: e.target.checked,
                                },
                              };
                            })
                          }
                        />
                      }
                      label={control.title}
                      labelPlacement="end"
                    />
                  </Grid>
                )
              )}
          </Grid>

          <br />
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />
        </>
      ) : (
        <></>
      )}

      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography>Control of: </Typography>
        </Grid>

        {defaultCheckBoxOptions?.controlOfCheckboxList &&
          defaultCheckBoxOptions?.controlOfCheckboxList?.length > 0 &&
          defaultCheckBoxOptions?.controlOfCheckboxList?.map(
            (control, index) => (
              <Grid
                item
                xs={4}
                md={2}
                key={index}
                sx={{
                  marginBottom: 0,
                }}
              >
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      // marginRight: 10,
                      marginBottom: "0 !important",
                    },
                  }}
                  // value={surveyDetail?.controlOf[control.name] || false}
                  control={
                    <Checkbox
                      checked={surveyDetail?.controlOf[control.name] || false}
                      disabled={dialogType === "view"}
                      size="medium"
                      onChange={(e) =>
                        setSurveyDetail((prev) => {
                          return {
                            ...prev,
                            controlOf: {
                              ...prev.controlOf,
                              [control.name]: e.target.checked,
                            },
                          };
                        })
                      }
                    />
                  }
                  label={control.title}
                  labelPlacement="end"
                />
              </Grid>
            )
          )}

        <Grid item xs={12} md={12}>
          <TextField
            margin="normal"
            variant="outlined"
            name="otherControlOf"
            label="Other"
            id="otherControlOf"
            type="text"
            value={surveyDetail?.otherControlOf || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  otherControlOf: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>
      </Grid>

      <br />
      <Divider
        sx={{
          borderStyle: "dotted",
        }}
      />
      <br />

      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography>Infestation: </Typography>
        </Grid>

        {defaultCheckBoxOptions?.infestationCheckboxList &&
          defaultCheckBoxOptions?.infestationCheckboxList?.length > 0 &&
          defaultCheckBoxOptions?.infestationCheckboxList?.map(
            (control, index) => (
              <Grid
                item
                xs={4}
                md={2}
                key={index}
                sx={{
                  marginBottom: 0,
                }}
              >
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      // marginRight: 10,
                      marginBottom: "0 !important",
                    },
                  }}
                  //value={surveyDetail?.infestation[control.name] || false}
                  control={
                    <Checkbox
                      checked={surveyDetail?.infestation[control.name] || false}
                      disabled={dialogType === "view"}
                      size="medium"
                      onChange={(e) =>
                        setSurveyDetail((prev) => {
                          return {
                            ...prev,
                            infestation: {
                              ...prev.infestation,
                              [control.name]: e.target.checked,
                            },
                          };
                        })
                      }
                    />
                  }
                  label={control.title}
                  labelPlacement="end"
                />
              </Grid>
            )
          )}

        <Grid item xs={12} md={12}>
          <TextField
            margin="normal"
            variant="outlined"
            name="infestationNote"
            label="Infestation note"
            id="infestationNote"
            type="text"
            value={surveyDetail?.infestationNote || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  infestationNote: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>
      </Grid>

      {documentType?.title === "Survey" ? (
        <>
          <br />
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                variant="outlined"
                name="typeOfCockroach"
                label="Type of Cockroaches"
                id="typeOfCockroach"
                type="text"
                value={surveyDetail?.typeOfCockroach || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      typeOfCockroach: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                name="typeOfTermite"
                label="Type of Termite"
                id="typeOfTermite"
                type="text"
                value={surveyDetail?.typeOfTermite || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      typeOfTermite: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="typeOfTermiteBait"
                label="(Qty) Bait"
                id="typeOfTermiteBait"
                type="text"
                value={surveyDetail?.typeOfTermiteBait || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      typeOfTermiteBait: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="typeOfTermiteTotal"
                label="(Rs)"
                id="typeOfTermiteTotal"
                type="text"
                value={surveyDetail?.typeOfTermiteTotal || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      typeOfTermiteTotal: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="solTreatmentmeter"
                label="Sol Treatment (m2)"
                id="solTreatmentmeter"
                type="text"
                value={surveyDetail?.solTreatmentmeter || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      solTreatmentmeter: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="solTreatmentFt"
                label="(ft)"
                id="solTreatmentFt"
                type="text"
                value={surveyDetail?.solTreatmentFt || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      solTreatmentFt: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="solTreatmentUnitPrice"
                label="Unit Price"
                id="solTreatmentUnitPrice"
                type="text"
                value={surveyDetail?.solTreatmentUnitPrice || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      solTreatmentUnitPrice: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                variant="outlined"
                name="solTreatmentTotal"
                label="Total"
                id="solTreatmentTotal"
                type="text"
                value={surveyDetail?.solTreatmentTotal || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      solTreatmentTotal: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Divider
                sx={{
                  borderStyle: "dotted",
                }}
              />
              <br />
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}

      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography>Control Vector Service Request: </Typography>
        </Grid>

        {defaultCheckBoxOptions?.controlVectorCheckboxList &&
          defaultCheckBoxOptions?.controlVectorCheckboxList?.length > 0 &&
          defaultCheckBoxOptions?.controlVectorCheckboxList?.map(
            (control, index) => (
              <Grid
                item
                xs={4}
                md={2}
                key={index}
                sx={{
                  marginBottom: 0,
                }}
              >
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      // marginRight: 10,
                      marginBottom: "0 !important",
                    },
                  }}
                  // value={surveyDetail?.controlVector[control.name] || false}
                  control={
                    <Checkbox
                      checked={
                        surveyDetail?.controlVector[control.name] || false
                      }
                      disabled={dialogType === "view"}
                      size="medium"
                      onChange={(e) =>
                        setSurveyDetail((prev) => {
                          return {
                            ...prev,
                            controlVector: {
                              ...prev.controlVector,
                              [control.name]: e.target.checked,
                            },
                          };
                        })
                      }
                    />
                  }
                  label={control.title}
                  labelPlacement="end"
                />
              </Grid>
            )
          )}
      </Grid>

      <br />
      <Divider
        sx={{
          borderStyle: "dotted",
        }}
      />
      <br />

      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography>Location Treated: </Typography>
        </Grid>

        {defaultCheckBoxOptions?.locationTreatedCheckboxList &&
          defaultCheckBoxOptions?.locationTreatedCheckboxList?.length > 0 &&
          defaultCheckBoxOptions?.locationTreatedCheckboxList?.map(
            (control, index) => (
              <Grid
                item
                xs={4}
                md={2}
                key={index}
                sx={{
                  marginBottom: 0,
                }}
              >
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      // marginRight: 10,
                      marginBottom: "0 !important",
                    },
                  }}
                  //value={surveyDetail?.locationTreated[control.name] || false}
                  control={
                    <Checkbox
                      checked={
                        surveyDetail?.locationTreated[control.name] || false
                      }
                      disabled={dialogType === "view"}
                      size="medium"
                      onChange={(e) =>
                        setSurveyDetail((prev) => {
                          return {
                            ...prev,
                            locationTreated: {
                              ...prev.locationTreated,
                              [control.name]: e.target.checked,
                            },
                          };
                        })
                      }
                    />
                  }
                  label={control.title}
                  labelPlacement="end"
                />
              </Grid>
            )
          )}

        <Grid item xs={12} md={12}>
          <TextField
            margin="normal"
            variant="outlined"
            name="otherLocationTreated"
            label="Other treated location"
            id="otherLocationTreated"
            type="text"
            value={surveyDetail?.otherLocationTreated || ""}
            size="large"
            fullWidth
            onChange={(event) => {
              setSurveyDetail((previous) => {
                return {
                  ...previous,
                  otherLocationTreated: event.target.value,
                };
              });
            }}
            disabled={dialogType === "view"}
          />
        </Grid>

        {documentType?.title === "Survey" ? (
          <Grid item xs={12} md={12}>
            <br />
            <Divider
              sx={{
                borderStyle: "dotted",
              }}
            />
            <br />
            <TextField
              margin="normal"
              variant="outlined"
              name="rodentBox"
              label="Rodent Box (S) 280 (M) 375 Rs"
              id="rodentBox"
              type="text"
              value={surveyDetail?.rodentBox || ""}
              size="large"
              fullWidth
              onChange={(event) => {
                setSurveyDetail((previous) => {
                  return {
                    ...previous,
                    rodentBox: event.target.value,
                  };
                });
              }}
              disabled={dialogType === "view"}
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {documentType?.title === "Service Report" ? (
        <>
          <Grid item xs={12} md={12}>
            <TextField
              margin="normal"
              variant="outlined"
              name="findings"
              label="Findings"
              id="findings"
              type="text"
              value={surveyDetail?.findings || ""}
              size="large"
              fullWidth
              onChange={(event) => {
                setSurveyDetail((previous) => {
                  return {
                    ...previous,
                    findings: event.target.value,
                  };
                });
              }}
              disabled={dialogType === "view"}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              margin="normal"
              variant="outlined"
              name="recommendationServiceReport"
              label="Recommendation"
              id="recommendationServiceReport"
              type="text"
              value={surveyDetail?.recommendationServiceReport || ""}
              size="large"
              fullWidth
              onChange={(event) => {
                setSurveyDetail((previous) => {
                  return {
                    ...previous,
                    recommendationServiceReport: event.target.value,
                  };
                });
              }}
              disabled={dialogType === "view"}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}

      {documentType?.title === "Survey" ? (
        <>
          <br />
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />

          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography>Recommendations </Typography>
            </Grid>

            {defaultCheckBoxOptions?.recommendationCheckboxList &&
              defaultCheckBoxOptions?.recommendationCheckboxList?.length > 0 &&
              defaultCheckBoxOptions?.recommendationCheckboxList?.map(
                (control, index) => (
                  <Grid
                    item
                    xs={4}
                    md={2}
                    key={index}
                    sx={{
                      marginBottom: 0,
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiFormControlLabel-root": {
                          // marginRight: 10,
                          marginBottom: "0 !important",
                        },
                      }}
                      value={
                        surveyDetail?.recommendation[control.name] || false
                      }
                      control={
                        <Checkbox
                          checked={
                            surveyDetail?.recommendation[control.name] || false
                          }
                          disabled={dialogType === "view"}
                          size="medium"
                          onChange={(e) =>
                            setSurveyDetail((prev) => {
                              return {
                                ...prev,
                                recommendation: {
                                  ...prev.recommendation,
                                  [control.name]: e.target.checked,
                                },
                              };
                            })
                          }
                        />
                      }
                      label={control.title}
                      labelPlacement="end"
                    />
                  </Grid>
                )
              )}
          </Grid>

          <br />
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                variant="outlined"
                name="evaluationPieces"
                label="EVALUATION (How many pieces)"
                id="evaluationPieces"
                type="text"
                value={surveyDetail?.evaluationPieces || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      evaluationPieces: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                name="estimateAmount"
                label="ESTIMATE (RS)"
                id="estimateAmount"
                type="text"
                value={surveyDetail?.estimateAmount || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      estimateAmount: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
