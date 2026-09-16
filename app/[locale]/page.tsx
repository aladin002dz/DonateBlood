import { isPlatformOnHold } from "@/lib/platform-status";
import HomeContent from "./home-content";

export default function HomePage() {
  return <HomeContent onHold={isPlatformOnHold()} />;
}
