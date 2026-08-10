export {
  useAuthControllerLogin,
  useAuthControllerRegister,
  useMagicLinkControllerRequest,
  useMagicLinkControllerVerify,
  useAuthControllerVerify,
  useAuthControllerResendVerification,
  useAuthControllerLogout,
  useAuthControllerGetProfile,
  useAuthControllerGoogleAuth,
  useAuthControllerGoogleAuthRedirect,
} from "@/lib/api/react-query/auth/auth";

export const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/google`;
