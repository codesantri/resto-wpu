'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function RouteProgress() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // Delay biar progress bar sempat muncul sebelum selesai
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
