import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organizationId: string | null;
      organization: {
        id: string;
        name: string;
        subscriptionStatus: string;
        pricingTier: string | null;
      } | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    organizationId: string | null;
    organization: {
      id: string;
      name: string;
      subscriptionStatus: string;
      pricingTier: string | null;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    organizationId: string | null;
    organization: {
      id: string;
      name: string;
      subscriptionStatus: string;
      pricingTier: string | null;
    } | null;
  }
}
