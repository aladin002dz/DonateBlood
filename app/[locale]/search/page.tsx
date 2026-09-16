import { PauseNoticeCard } from "@/components/pause-notice-card";
import { isPlatformOnHold } from "@/lib/platform-status";
import SearchClient from "./search-client";

export default function SearchPage() {
  if (isPlatformOnHold()) {
    return <PauseNoticeCard />;
  }

  return <SearchClient />;
}
