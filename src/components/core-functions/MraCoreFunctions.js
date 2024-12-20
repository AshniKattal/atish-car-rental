import axios from "axios";
import forge from "node-forge";
import crypto from "crypto-browserify";
import { v4 as uuidv4 } from "uuid";

export async function getMraToken() {
  return await new Promise(async (resolve) => {
    try {
      // MRA public key
      const publicKeyPem = `-----BEGIN CERTIFICATE-----
      MIIHzDCCBrSgAwIBAgIQATOlq8rr+bz45AKNMIfp1zANBgkqhkiG9w0BAQ0FADBZ
      MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMTMwMQYDVQQDEypE
      aWdpQ2VydCBHbG9iYWwgRzIgVExTIFJTQSBTSEEyNTYgMjAyMCBDQTEwHhcNMjQw
      MzA2MDAwMDAwWhcNMjUwNDA2MjM1OTU5WjBfMQswCQYDVQQGEwJNVTETMBEGA1UE
      BxMKUG9ydCBMb3VpczEkMCIGA1UEChMbTWF1cml0aXVzIFJldmVudWUgQXV0aG9y
      aXR5MRUwEwYDVQQDEwx2ZmlzYy5tcmEubXUwggIiMA0GCSqGSIb3DQEBAQUAA4IC
      DwAwggIKAoICAQCarsTAIeMek52K8SCbH2jD84fmIXjSHohXZU/GSgVfEBnwk2Wv
      ZXeJfkRMSWU4vdDJlsTDi0luDg5oArCWrZldiVpfpegXDj+daNVzj4d3QP/HgI02
      Q/+7yKRIV42orUXbyVDXqqukLW/JvGpzwHD4D4KbnV/3hjMxeMiQo7Yb08T+kytK
      cPdZWKyu85MXwaA/dBtkpkaXunYMRYqewLdJBbFK7QcI/mQ+1jxCS+F4IMSqGj+0
      Qct9V3MgXKEzh9iATDfXxejHrF5J59etSleRZBkIat2NPQ5n07miTpgVq1z33H8s
      jc44CXbJCemM1IzZD/IwiB2WNZaG2NaqSoQrUHrlIcrDRcz++nrtVvjLsrh1NZ8f
      IGvd+DkLrQ4HexI/k+rpSu2sh7C6AD1XkbhQwKD9rchNIgXQXuOVrQC4XpPHzjiq
      HRIAebSbnzdANV7NsnaTt1hslzLF995yi3RKcVoSiULUPJxWQLxO5evx9GpsoYc3
      zk9Hfdupa7m+i786Riqn5cLoYfr6XbPTKDZuQwavsiN+5h/7YR5KwFoeGzSWB00d
      BBSKoU4Cu2VWmjhaSritCKUcOP5T65PkKOsAFbz2CkqYWS8mSWksEKOi6YOwFkV1
      oqwI8sTbL5Cgdaxd1szqQcwgup2xfOx737Fi4JXdi/DXC3DyNqbmUJXO0wIDAQAB
      o4IDiDCCA4QwHwYDVR0jBBgwFoAUdIWAwGbH3zfez70pN6oDHb7tzRcwHQYDVR0O
      BBYEFF6twzXWvLU6IDuYN5KJP8/tQbXnMBcGA1UdEQQQMA6CDHZmaXNjLm1yYS5t
      dTA+BgNVHSAENzA1MDMGBmeBDAECAjApMCcGCCsGAQUFBwIBFhtodHRwOi8vd3d3
      LmRpZ2ljZXJ0LmNvbS9DUFMwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsG
      AQUFBwMBBggrBgEFBQcDAjCBnwYDVR0fBIGXMIGUMEigRqBEhkJodHRwOi8vY3Js
      My5kaWdpY2VydC5jb20vRGlnaUNlcnRHbG9iYWxHMlRMU1JTQVNIQTI1NjIwMjBD
      QTEtMS5jcmwwSKBGoESGQmh0dHA6Ly9jcmw0LmRpZ2ljZXJ0LmNvbS9EaWdpQ2Vy
      dEdsb2JhbEcyVExTUlNBU0hBMjU2MjAyMENBMS0xLmNybDCBhwYIKwYBBQUHAQEE
      ezB5MCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wUQYIKwYB
      BQUHMAKGRWh0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2Jh
      bEcyVExTUlNBU0hBMjU2MjAyMENBMS0xLmNydDAMBgNVHRMBAf8EAjAAMIIBfgYK
      KwYBBAHWeQIEAgSCAW4EggFqAWgAdgBOdaMnXJoQwzhbbNTfP1LrHfDgjhuNacCx
      +mSxYpo53wAAAY4SfG88AAAEAwBHMEUCIGwBW0JKDMf5v0c4Q0ENquSyK7djcGBS
      19Vh4qmgeLskAiEAnnfRKHJE2Dl0veefl6LI/kHXffX7B7wR/q/zNl7b90sAdgB9
      WR4S4XgqexxhZ3xe/fjQh1wUoE6VnrkDL9kOjC55uAAAAY4SfG94AAAEAwBHMEUC
      IQCSgrjqSOfd3JvzsGTWBDjj9NZhe3A1WKK+zwHqDVFN8wIgJK7lAUfgg90c+gDe
      I/4EEm8zM8V94LeU+xfuHmzvCqgAdgDm0jFjQHeMwRBBBtdxuc7B0kD2loSG+7qH
      Mh39HjeOUAAAAY4SfG+hAAAEAwBHMEUCICl+2WzSohm4ulRIhVPXhOd6Bse7/b77
      Ov+4+a4+CVMKAiEAhwCoYUHc5VdX2KvcGQKb+YBlUqotLNLtLSx/uQBHRnswDQYJ
      KoZIhvcNAQENBQADggEBAJ5QSyiJcogw87bz0mC/GxdIcVr3aAJ2rKuDFbW8edSv
      YgC80/4ao4QdGe313zEmsYEbeNePXlizzBH9pO87uXrYgvGlxP2Tl4RlGAEpeqnt
      +jwVlSI55SnVHGLgLmArLjXDF3DaCcuB3O/5ie2SiX3LAh0sBfQXBCFh93tdFI5i
      flONp08s0cHC0PguVMlgEUoO7oo3Si8ZwPQlLVjjwTMqC/31gdUNkHQ221DFjZwv
      Or4/vetWVS2pHX2e5mPvNxXk3lxAp/5XpnYnlOUUA5c5m4STJkXYrVzq951uTrXw
      64WFMM+DzIFxGghEXRo3awtlomOgSTalC/GrlrYVZzw=
      -----END CERTIFICATE-----`;

      // Generate a random 32-byte (256-bit) AES key
      const aesKey = crypto.randomBytes(32);

      // Encode AES key to a Base64-encoded string
      const aesKeyBase64 = aesKey.toString("base64");

      // request payload
      const requestPayload = {
        username: process.env.REACT_APP_EBS_MRA_USERNAME,
        password: process.env.REACT_APP_EBS_MRA_PASSWORD,
        encryptKey: aesKeyBase64,
        refreshToken: process.env.REACT_APP_EBS_MRA_REFRESH_TOKEN_PARAM,
      };

      // convert request payload to string
      const payloadString = JSON.stringify(requestPayload);

      // Create a public key object from PEM string
      const publicKey = forge.pki.certificateFromPem(publicKeyPem).publicKey;

      // Encrypt the JSON string with RSA
      const encryptedData = forge.util.encode64(
        publicKey.encrypt(payloadString)
      );

      await axios
        .post(
          process.env.REACT_APP_EBS_MRA_TOKEN_ENDPOINT,
          {
            requestId: uuidv4(),
            payload: encryptedData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Max-Age": "1800",
              "Access-Control-Allow-Headers": "content-type",
              "Access-Control-Allow-Methods":
                "PUT, POST, GET, DELETE, PATCH, OPTIONS",
              Accept: "*/*",
              ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
              username: process.env.REACT_APP_EBS_MRA_USERNAME,
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          resolve({ error: true, message: error?.message });
        });
    } catch (error) {
      resolve({ error: true, message: error?.message });
    }
  });
}
