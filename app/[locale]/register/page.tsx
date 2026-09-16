import { PauseNoticeCard } from "@/components/pause-notice-card";
import { isPlatformOnHold } from "@/lib/platform-status";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  if (isPlatformOnHold()) {
    return <PauseNoticeCard />;
  }

  return <RegisterForm />;
}
