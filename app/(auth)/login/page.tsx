import { Button } from "@/components/ui/button";
import { baseUrl } from "@/utils/const";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata = {
    title: "Login",
    robots: {
        index: false,
        follow: false,
    }
} satisfies Metadata


export default function Login() {

    const state = "{}"
    const redirect_uri = `${baseUrl}/api/oauth/google`
    const client_id = process.env.GOOGLE_CLIENT_ID!
    // https://developers.google.com/identity/protocols/oauth2/web-server#httprest
    const googleOauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email&access_type=offline&state=${state}`;

    return (
       <>
        <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="/logo.png"
                className="h-12 w-auto"
              />
            </a>
          </div>
     
         
     
        </nav>
       
      </header>
      
        <div className="flex h-screen w-full items-center justify-center flex-col overflow-hidden">
            {/* // make the login link max size  */}
            <Link
                href={googleOauthUrl}
                // style={{ fontSize: "clamp(1.5rem, 35vw, 2000rem)" }}
                className="login-link p-2 w-full text-center"
            >
                <Button variant={"outline"}>
                    <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="google" className="h-6 w-6 mr-2" />
                     Sign in</Button>
            </Link>
        </div>
       </>
    )
}