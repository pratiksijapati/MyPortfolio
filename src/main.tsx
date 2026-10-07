import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { getRoute } from "./lib/routes";
import "./styles/global.css";

// Sub-pages are separate chunks, so the home page doesn't download them.
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const DesignCaseStudyPage = lazy(() => import("./pages/DesignCaseStudyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const route = getRoute(window.location.pathname);

function Root() {
  switch (route.name) {
    case "home":
      return <App />;
    case "project":
      return <ProjectPage slug={route.slug} />;
    case "design":
      return <DesignCaseStudyPage slug={route.slug} />;
    default:
      return <NotFoundPage />;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Root />
    </Suspense>
  </StrictMode>,
);
