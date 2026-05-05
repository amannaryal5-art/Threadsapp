import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { AppButton } from "@/components/shared/AppButton";

export function SocialButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppButton variant="outline">
        <FaGoogle className="h-4 w-4" />
        Continue with Google
      </AppButton>
      <AppButton variant="outline">
        <FaFacebookF className="h-4 w-4" />
        Continue with Facebook
      </AppButton>
    </div>
  );
}
