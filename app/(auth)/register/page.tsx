import Nav from "@/components/nav";
import { SignInForm } from "@/components/signin-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/utils/const";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Register",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default function Register() {
  const state = "{}";
  const redirect_uri = `${baseUrl}/api/oauth/google`;
  const client_id = process.env.GOOGLE_CLIENT_ID!;
  // https://developers.google.com/identity/protocols/oauth2/web-server#httprest
  const googleOauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email&access_type=offline&state=${state}`;

  return (
    <>
      <Nav />
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
    <Card className="w-full max-w-sm shadow-md border border-slate-800 p-10">
    <div className="w-full max-w-sm">
          <SignInForm googleOauthUrl={googleOauthUrl} />
        </div>
    </Card>
      </div>
    </>
  );
}
