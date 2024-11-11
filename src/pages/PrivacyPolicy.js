import { Container, Stack, Typography } from "@mui/material";
import Page from "src/components/Page";
import { styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PrivacyPolicy() {
  return (
    <>
      <Page title="Privacy policy">
        <RootStyle>
          <Container>
            <Stack spacing={3}>
              <Typography variant="h3">Privacy Policy</Typography>
              <Typography variant="h5">Effective Date: 01-01-2024</Typography>
              <Stack spacing={1}>
                <Typography variant="h5">1. Introduction</Typography>
                <Typography>
                  Welcome to Invoicing app powered by FerToSiteWeb Limited
                  ("we," "our," "us"). We are committed to protecting your
                  privacy and ensuring that your personal information is handled
                  in a safe and responsible manner. This Privacy Policy
                  describes how we collect, use, and share information about you
                  when you visit and use our website ("Service").
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">2. Information We Collect</Typography>
                <Typography>
                  We collect various types of information in connection with the
                  services we provide, including:
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">2.1 Personal Information</Typography>
                <ul>
                  <li>
                    <Typography>
                      Registration Information: When you register on our
                      website, we collect personal information such as your
                      name, email address, company name, type of company, BRN,
                      address, contact number, phone number, and VAT number.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Financial Information: For invoicing and payment purposes,
                      we may collect your bank account details (bank name, bank
                      account number and bank beneficiary name) or payment card
                      information.
                    </Typography>
                  </li>
                </ul>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">2.2 Usage Information</Typography>
                <ul>
                  <li>
                    <Typography>
                      Log Data: We automatically collect information that your
                      browser sends whenever you visit our website. This log
                      data may include your IP address, browser type, browser
                      version, the pages of our website that you visit, the time
                      and date of your visit, the time spent on those pages, and
                      other statistics.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Cookies and Similar Technologies: We use cookies to
                      collect information to improve our services and your
                      experience on our website.
                    </Typography>
                  </li>
                </ul>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">
                  3. How We Use Your Information
                </Typography>

                <Typography>
                  We use the information we collect for various purposes,
                  including:
                </Typography>

                <ul>
                  <li>
                    To Provide and Maintain Our Service: We use your information
                    to create and manage your account, process transactions, and
                    provide the features and functionality of our website.
                  </li>
                  <li>
                    To Communicate With You: We use your contact information to
                    send you updates, newsletters, marketing materials, and
                    other information that may be of interest to you. You can
                    opt out of receiving these communications at any time.
                  </li>
                  <li>
                    To Improve Our Services: We analyze usage data to understand
                    how our service is used and to improve its functionality and
                    user experience.
                  </li>
                  <li>
                    To Comply With Legal Obligations: We may use your
                    information to comply with applicable laws and regulations,
                    including tax and accounting requirements.
                  </li>
                </ul>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">
                  4. Sharing Your Information
                </Typography>

                <Typography>
                  We do not sell or rent your personal information to third
                  parties. We may share your information with:
                </Typography>

                <ul>
                  <li>
                    <Typography>
                      Service Providers: We may share your information with
                      third-party vendors, consultants, and other service
                      providers who perform services on our behalf.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Legal Requirements: We may disclose your information if
                      required to do so by law or in response to valid requests
                      by public authorities (e.g., a court or a government
                      agency).
                    </Typography>
                  </li>
                </ul>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h5">5. Data Security</Typography>

                <Typography>
                  We take reasonable measures to protect the information we
                  collect from unauthorized access, use, and disclosure.
                  However, no internet or email transmission is ever fully
                  secure or error-free. Please keep this in mind when disclosing
                  any personal information to us.
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="h5">6. Your Rights</Typography>

                <Typography>
                  You have certain rights regarding your personal information,
                  subject to local data protection laws. These may include the
                  right to:
                </Typography>

                <ul>
                  <li>
                    <Typography>Access your personal information.</Typography>
                  </li>
                  <li>
                    <Typography>
                      Correct or update your personal information.
                    </Typography>
                  </li>
                  <li>
                    <Typography>Delete your personal information.</Typography>
                  </li>
                  <li>
                    <Typography>
                      Restrict the processing of your personal information.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Object to the processing of your personal information.
                    </Typography>
                  </li>
                  <li>
                    <Typography>Data portability.</Typography>
                  </li>
                </ul>

                <Typography>
                  To exercise these rights, please contact us at{" "}
                  <span>
                    <p>
                      <a href="mailto:contact@fertositeweb.com">
                        contact@fertositeweb.com.
                      </a>
                    </p>
                  </span>
                </Typography>
              </Stack>
            </Stack>
          </Container>
        </RootStyle>
      </Page>
    </>
  );
}
