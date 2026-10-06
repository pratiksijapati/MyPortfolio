import { useEffect, useState } from "react";
import { fetchGithubData, githubSnapshot, type GithubData } from "../lib/github";

/**
 * Starts with the build-time snapshot (so projects render immediately and never show
 * an error), then quietly upgrades to live GitHub data once the browser is idle.
 */
export function useGithubData(): GithubData {
  const [data, setData] = useState<GithubData>(githubSnapshot);

  useEffect(() => {
    const controller = new AbortController();
    const run = () =>
      fetchGithubData(controller.signal).then((live) => {
        if (live && live.repos.length > 0) setData(live);
      });
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const handle = idle(run);
    return () => {
      controller.abort();
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
    };
  }, []);

  return data;
}
