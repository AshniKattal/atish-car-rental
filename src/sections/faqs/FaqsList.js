// @mui
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  Card,
} from "@mui/material";
// _mock_
// components
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

export default function FaqsList() {
  const faqList = [
    {
      value: "",
      heading: `Are your cars manual or automatic?`,
      detail: (
        <>
          <Typography>All of our cars have automatic transmissions.</Typography>
        </>
      ),
    },
    {
      value: "",
      heading: `Do you offer airport pick-up & drop-off services?`,
      detail: (
        <>
          <Typography>
            Yes we do offer free pick-up & drop-off services at the airport and
            an additional cost for other location.
          </Typography>
          <b />
          <Typography>
            Please note: Flight details and delays must be communicated to RHL
            to prevent unnecessary waiting time.
          </Typography>
        </>
      ),
    },
    {
      value: "",
      heading: `Do you provide longterm rental?`,
      detail: (
        <>
          <Typography>
            Yes we provide long term car rental in Mauritius.
          </Typography>
          <b />
          <Typography>
            We also provide corporate deals - Weekly deals, monthly deals,
            trimonthly deals ,half year deals and annual deals
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `How can I book my rental car on-line?`,
      detail: (
        <>
          <Typography>
            The rental process is fast and straightforward. After reserving your
            car on our website, you'll receive an email confirming we’ve
            received your information. We’ll review the details and check
            availability, and within two business days, you'll receive a formal
            reservation confirmation via email. Simply present this confirmation
            at the car rental desk, and you're ready to hit the road and enjoy
            your dream vacation.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `How do I return my rental car on Mauritius?`,
      detail: (
        <>
          <Typography>
            The return process is just as easy as the pick-up. If you choose to
            drop off the car at the airport, a rental employee will meet you at
            the agreed time near the departure gate to collect the vehicle. For
            hotel drop-offs, a service representative will come to your location
            at the scheduled time. Please ensure the car is returned in the same
            condition as when you received it, and that the fuel tank is at the
            same level as upon pick-up.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `What languages do you speak?`,
      detail: (
        <>
          <Typography>
            Employees at RHL speak: English, French or Creole.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `Can i drive with my foreign license in Mauritius?`,
      detail: (
        <>
          <Typography>
            Tourists are allowed to use their foreign driving licence in
            Mauritius.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `Can i pre-book child seats on this website?`,
      detail: (
        <>
          <Typography>
            Yes, you can pre-book child seats and child booster seats during the
            online booking process.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `What is the maximum speed limit in Mauritius?`,
      detail: (
        <>
          <Typography>
            The speed limit varies from 40 km/h from 110 km/h depending on which
            road you are driving. Please be sure to adhere to the appropriate
            speed limits.
          </Typography>
        </>
      ),
    },

    {
      value: "",
      heading: `Should I drive on the left or right?`,
      detail: (
        <>
          <Typography>
            All cars are right handed in Mauritius while the driving is done on
            the left.
          </Typography>
        </>
      ),
    },
  ];

  return (
    <div data-aos="fade-in" data-aos-easing="linear" data-aos-duration="1000">
      <Card sx={{ p: 3 }}>
        {faqList.map((accordion, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={
                <Iconify
                  icon={"eva:arrow-ios-downward-fill"}
                  width={20}
                  height={20}
                />
              }
            >
              <Typography variant="subtitle1">{accordion.heading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{accordion.detail}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
    </div>
  );
}
