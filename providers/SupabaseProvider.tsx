"use client";

import { Database } from "@/types_db";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React, { useState } from "react";

interface SupabaseProvidersProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProvidersProps> = ({ children }) => {
  const [supabaseClient] = useState(() => {
    return createPagesBrowserClient<Database>();
  });
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;
