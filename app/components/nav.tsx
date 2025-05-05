import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Nav = () => {

  return (
    <>
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex lg:flex-1">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  alt=""
                  src="/logo.png"
                  className="h-12 w-auto"
                  width={100}
                  height={100}
                />
              </a>
            </div>

            <div className="">
              <Link href="/login" className=" font-semibold leading-6">
                <Button className=" p-2">
                  Sign in{" "}
                  <span aria-hidden="true" className="ml-2">
                    &rarr;
                  </span>
                </Button>
              </Link>
            </div>
          </nav>
        </header>
    </>
  );
};

export default Nav;
