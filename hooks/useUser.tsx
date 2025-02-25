import { subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { createContext } from "react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  UserDetails: UserDetails | null;
  isLoading: boolean;
  subscription: subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
