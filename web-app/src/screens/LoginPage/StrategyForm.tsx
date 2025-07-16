// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  DropdownSelector,
  Grid,
  InputBox,
  LockFilledIcon,
  LogoutIcon,
  PasswordKeyIcon,
  ProgressBar,
  Select,
  UserFilledIcon,
} from "mds";
import styled from "styled-components";
import {
  setAccessKey,
  setDisplayEmbeddedIDPForms,
  setSecretKey,
  setSTS,
  setUseSTS,
} from "./loginSlice";

import { AppState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { doLoginAsync } from "./loginThunks";
import { RedirectRule } from "api/consoleApi";

// Dark theme wrapper for form components
const DarkFormWrapper = styled.div(() => ({
  width: "100%",
  
  // Global input styling with autofill override
  "& input": {
    backgroundColor: "#1C2436 !important",
    borderColor: "#8E98A9 !important",
    color: "#C4C9D0 !important",
    "&::placeholder": {
      color: "#8E98A9 !important",
    },
    "&:focus": {
      borderColor: "#58FAB1 !important",
      boxShadow: "0 0 0 1px #58FAB1 !important",
    },
    // Keep autofill styles dark
    "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active": {
      "-webkit-box-shadow": "0 0 0 30px #1C2436 inset !important",
      "-webkit-text-fill-color": "#C4C9D0 !important",
    },
  },
  
  // Input field containers
  "& .MuiInputBase-root": {
    backgroundColor: "#1C2436 !important",
    borderColor: "#8E98A9 !important",
    color: "#C4C9D0 !important",
  },
  
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1C2436 !important",
    "& fieldset": {
      borderColor: "#8E98A9 !important",
    },
    "&:hover fieldset": {
      borderColor: "#8E98A9 !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#58FAB1 !important",
    },
  },
  
  // Button styling - clean white/gray theme
  "& button": {
    backgroundColor: "#FFFFFF !important",
    color: "#000000 !important",
    border: "1px solid #E0E0E0 !important",
    "&:hover": {
      backgroundColor: "#F5F5F5 !important",
    },
    "&:disabled": {
      backgroundColor: "#9E9E9E !important",
      color: "#616161 !important",
      border: "1px solid #BDBDBD !important",
    },
  },
  
  // More specific button targeting
  "& .MuiButton-root, & [role='button']": {
    backgroundColor: "#FFFFFF !important",
    color: "#000000 !important",
    border: "1px solid #E0E0E0 !important",
    "&:hover": {
      backgroundColor: "#F5F5F5 !important",
    },
    "&:disabled": {
      backgroundColor: "#9E9E9E !important",
      color: "#616161 !important",
    },
  },
  
  // Select dropdown styling
  "& select": {
    backgroundColor: "#1C2436 !important",
    borderColor: "#8E98A9 !important",
    color: "#C4C9D0 !important",
  },
  
  // Progress bar
  "& .MuiLinearProgress-root": {
    backgroundColor: "#4B586A !important",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#58FAB1 !important",
    },
  },
  
  // Keep input icons white
  "& .MuiInputAdornment-root svg, & .MuiInputAdornment-root svg path": {
    color: "#FFFFFF !important",
    fill: "#FFFFFF !important",
  },
  
  // Clean input targeting - only specific inputs
  "& input[type='text'], & input[type='password'], & input[name]": {
    backgroundColor: "#1C2436 !important",
    border: "1px solid #8E98A9 !important",
    borderRadius: "4px !important",
    color: "#C4C9D0 !important",
    "&::placeholder": {
      color: "#8E98A9 !important",
    },
    "&:focus": {
      borderColor: "#58FAB1 !important",
      outline: "none !important",
    },
  },
}));

const StrategyForm = ({ redirectRules }: { redirectRules: RedirectRule[] }) => {
  const dispatch = useAppDispatch();

  const [ssoOptionsOpen, ssoOptionsSetOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  const accessKey = useSelector((state: AppState) => state.login.accessKey);
  const secretKey = useSelector((state: AppState) => state.login.secretKey);
  const sts = useSelector((state: AppState) => state.login.sts);
  const useSTS = useSelector((state: AppState) => state.login.useSTS);
  const displaySSOForm = useSelector(
    (state: AppState) => state.login.ssoEmbeddedIDPDisplay,
  );

  const loginSending = useSelector(
    (state: AppState) => state.login.loginSending,
  );

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLoginAsync());
  };

  let selectOptions = [
    {
      label: useSTS ? "Use Credentials" : "Use STS",
      value: useSTS ? "use-sts-cred" : "use-sts",
    },
  ];
  let ssoOptions: any[] = [];

  if (redirectRules.length > 0) {
    ssoOptions = redirectRules.map((r) => ({
      label: `${r.displayName}${r.serviceType ? ` - ${r.serviceType}` : ""}`,
      value: r.redirect,
      icon: <LogoutIcon />,
    }));

    selectOptions = [
      { label: "Use Credentials", value: "use-sts-cred" },
      { label: "Use STS", value: "use-sts" },
    ];
  }

  const extraActionSelector = (value: string) => {
    if (value) {
      if (redirectRules.length > 0) {
        let stsState = true;

        if (value === "use-sts-cred") {
          stsState = false;
        }

        dispatch(setUseSTS(stsState));
        dispatch(setDisplayEmbeddedIDPForms(true));

        return;
      }

      if (value.includes("use-sts")) {
        dispatch(setUseSTS(!useSTS));
        return;
      }
    }
  };

  const submitSSOInitRequest = (value: string) => {
    window.location.href = value;
  };

  return (
    <DarkFormWrapper>
      <React.Fragment>
        {redirectRules.length > 0 && (
          <Fragment>
            <Box sx={{ marginBottom: 40 }}>
              <Button
                id={"SSOSelector"}
                variant={"subAction"}
                label={
                  redirectRules.length === 1
                    ? `${redirectRules[0].displayName}${
                        redirectRules[0].serviceType
                          ? ` - ${redirectRules[0].serviceType}`
                          : ""
                      }`
                    : `Login with SSO`
                }
                fullWidth
                sx={{ height: 50 }}
                onClick={(e) => {
                  if (redirectRules.length > 1) {
                    ssoOptionsSetOpen(!ssoOptionsOpen);
                    setAnchorEl(e.currentTarget);
                    return;
                  }
                  submitSSOInitRequest(`${redirectRules[0].redirect}`);
                }}
              />
              {redirectRules.length > 1 && (
                <DropdownSelector
                  id={"redirect-rules"}
                  options={ssoOptions}
                  selectedOption={""}
                  onSelect={(nValue) => submitSSOInitRequest(nValue)}
                  hideTriggerAction={() => {
                    ssoOptionsSetOpen(false);
                  }}
                  open={ssoOptionsOpen}
                  anchorEl={anchorEl}
                  useAnchorWidth={true}
                />
              )}
            </Box>
          </Fragment>
        )}

        <form noValidate onSubmit={formSubmit} style={{ width: "100%" }}>
          {((displaySSOForm && redirectRules.length > 0) ||
            redirectRules.length === 0) && (
            <Fragment>
              <Grid
                container
                sx={{
                  marginTop: redirectRules.length > 0 ? 55 : 0,
                }}
              >
                <Grid item xs={12} sx={{ marginBottom: 14 }}>
                  <InputBox
                    fullWidth
                    id="accessKey"
                    value={accessKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setAccessKey(e.target.value))
                    }
                    placeholder={useSTS ? "STS Username" : "Username"}
                    name="accessKey"
                    autoComplete="username"
                    disabled={loginSending}
                    spellCheck={false}
                    startIcon={<UserFilledIcon />}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: useSTS ? 14 : 0 }}>
                  <InputBox
                    fullWidth
                    value={secretKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setSecretKey(e.target.value))
                    }
                    name="secretKey"
                    type="password"
                    id="secretKey"
                    autoComplete="current-password"
                    disabled={loginSending}
                    spellCheck={false}
                    placeholder={useSTS ? "STS Secret" : "Password"}
                    startIcon={<LockFilledIcon />}
                  />
                </Grid>
                {useSTS && (
                  <Grid item xs={12}>
                    <InputBox
                      fullWidth
                      id="sts"
                      value={sts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch(setSTS(e.target.value))
                      }
                      placeholder={"STS Token"}
                      name="STS"
                      autoComplete="sts"
                      disabled={loginSending}
                      startIcon={<PasswordKeyIcon />}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  textAlign: "right",
                  marginTop: 30,
                }}
              >
                <Button
                  type="submit"
                  variant="callAction"
                  // color="primary"
                  id="do-login"
                  disabled={
                    (!useSTS && (accessKey === "" || secretKey === "")) ||
                    (useSTS &&
                      (accessKey === "" || secretKey === "" || sts === "")) ||
                    loginSending
                  }
                  label={"Login"}
                  sx={{
                    margin: "30px 0px 8px",
                    height: 40,
                    width: "100%",
                    boxShadow: "none",
                    padding: "16px 30px",
                  }}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  height: 10,
                }}
              >
                {loginSending && <ProgressBar />}
              </Grid>
            </Fragment>
          )}
          <Grid item xs={12} sx={{ marginTop: 45 }}>
            <Select
              id="alternativeMethods"
              name="alternativeMethods"
              fixedLabel="Other Authentication Methods"
              options={selectOptions}
              onChange={extraActionSelector}
              value={""}
            />
          </Grid>
        </form>
      </React.Fragment>
    </DarkFormWrapper>
  );
};

export default StrategyForm;