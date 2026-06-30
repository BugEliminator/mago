"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { shouldShowBottomNav } from "@/lib/bottomNavPaths";
import BottomNav from "./BottomNav";

/**
 * 특정 경로·추가정보 모달에서는 하단 nav를 숨김
 */
export default function ConditionalBottomNav() {
  const pathname = usePathname();
  const [hiddenByProfileModal, setHiddenByProfileModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setHiddenByProfileModal(
        document.body.hasAttribute("data-profile-extra-modal-open"),
      );
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-profile-extra-modal-open"],
    });

    return () => observer.disconnect();
  }, []);

  if (!shouldShowBottomNav(pathname) || hiddenByProfileModal) {
    return null;
  }

  return <BottomNav />;
}
