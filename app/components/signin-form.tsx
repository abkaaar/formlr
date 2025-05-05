import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tw";
import Image from "next/image";
import Link from "next/link";

type SignInFormProps = React.ComponentPropsWithoutRef<"div"> & {
  googleOauthUrl: string;
};

export function SignInForm({
  className,
  googleOauthUrl,
  ...props
}: SignInFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Welcome to Formlr</h1>
          <Link
            href={googleOauthUrl}
            className="login-link p-2 w-full text-center"
          >
            <Button variant={"outline"}>
              <Image
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="google"
                className="h-6 w-6 mr-2"
                height={100}
                width={100}
              />
              Sign in
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By signing in or clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
