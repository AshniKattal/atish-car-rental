import { lazy, Suspense } from "react";
import Page from "../../components/Page";
import LoadingScreenBlankPage from "../../components/LoadingScreenBlankPage";

const ContactUs = lazy(() => import("./ContactUs"));
const Features = lazy(() => import("./Features"));
const Footer = lazy(() => import("./Footer"));
const HomeHero = lazy(() => import("./HomeHero"));
const HowToProceed = lazy(() => import("./HowToProceed"));
const Pricing = lazy(() => import("./Pricing"));

export default function Home() {
  return (
    <>
      <Page title="Mo Facture">
        <Suspense fallback={<LoadingScreenBlankPage />}>
          <HomeHero />
        </Suspense>

        <Suspense fallback={<></>}>
          <Features />
        </Suspense>

        {/* <Suspense fallback={<></>}>
          <ComplainceBanner />
        </Suspense> */}

        <Suspense fallback={<></>}>
          <Pricing />
        </Suspense>

        <Suspense fallback={<></>}>
          <HowToProceed />
        </Suspense>

        <Suspense fallback={<></>}>
          <ContactUs />
        </Suspense>

        <Suspense fallback={<></>}>
          <Footer />
        </Suspense>
      </Page>
    </>
  );
}
