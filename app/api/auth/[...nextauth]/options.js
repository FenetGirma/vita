import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { SupabaseAdapter } from "@auth/supabase-adapter";
import { supabaseAdmin } from "../../../../lib/supaBaseAdmin"; // server client
const ADMIN_EMAIL = "liya.daniel.zeleke@gmail.com";
const RESPONDERS = ["fireman@gmail.com", "police@gmail.com"];

export const authOptions = {
  // adapter: SupabaseAdapter({
  //   url: process.env.SUPABASE_URL,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  // }),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        let role = "Github User";
        if (profile?.email === "liya.daniel.zeleke@gmail.com") role = "admin";
        return { ...profile, role };
      },
    }),
    GoogleProvider({
      profile(profile) {
        // console.log("Profile Google: ", profile);
        let userRole = "Google User";

        if (profile?.email == "liya.daniel.zeleke@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Use the server-side supabase client
          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          console.log("Supabase login data:", data);
          console.log("Supabase login error:", error);

          if (error || !data?.user) {
            console.log("Login failed:", error?.message);
            return null; // NextAuth will return 401
          }

          // Determine role (from metadata if exists)
          const userRole = data.user.user_metadata?.role || "user";

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email,
            role: userRole,
          };
        } catch (err) {
          console.error("Unexpected login error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role ?? token.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
