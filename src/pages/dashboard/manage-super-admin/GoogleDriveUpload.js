import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Button } from "@mui/material";

const CLIENT_ID =
  "198028123618-ps6h7lvhdtg9ho9km0u4htmq535lbrko.apps.googleusercontent.com";
const API_KEY = "AIzaSyAuUzKzg8D3zZkgeEz7oXFwBDnMulZX26I";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const GoogleDriveUpload = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
          setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleSignInClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", file);

    fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + gapi.auth.getToken().access_token,
        }),
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("File uploaded successfully", result);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div>
      {isSignedIn ? (
        <Button variant="contained" onClick={handleSignOutClick}>
          Sign Out
        </Button>
      ) : (
        <Button variant="contained" onClick={handleSignInClick}>
          Sign In
        </Button>
      )}
      {isSignedIn && (
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </div>
      )}
    </div>
  );
};

export default GoogleDriveUpload;
