"use client";

import { Database } from "@/types_db";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React, { useState } from "react";

interface SupabaseProvidersProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProvidersProps> = ({ children }) => {
  const [supabaseClient] = useState(() => {
    return createBrowserSupabaseClient<Database>();
  });
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
