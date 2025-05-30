"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Nav from "@/components/nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, Smartphone, PieChart, Layout } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample data for chart
const responseData = [
  { name: "Mon", responses: 12 },
  { name: "Tue", responses: 19 },
  { name: "Wed", responses: 10 },
  { name: "Thu", responses: 22 },
  { name: "Fri", responses: 25 },
  { name: "Sat", responses: 13 },
  { name: "Sun", responses: 18 },
];

export default function Home() {
  return (
    <>
      <Nav />
      <section className="bg-white px-6">
        <div className="flex flex-col gap-8 mx-auto py-32 sm:py-38 lg:py-36">
          <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Get  <span className="text-primary">Academic Insights</span>  Faster & Smarter.
            </h1>
            <p className="text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Formlr is a survey creation tool that lets users create,
              distribute, and analyze surveys with ease.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="">
              <Button
                variant="outline"
                className="py-6 bg-primary hover:bg-primary/90 border-none"
              >
                Get started - it's Free
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant={"outline"}
                className="py-6 bg-transparent text-primary border-primary hover:bg-primary"
              >
                Watch demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
          {/* Floating accent elements */}
      <div className="absolute top-1/4 right-20 w-5 h-5 bg-primary/30 rounded-full animate-ping "></div>
      <div className="absolute bottom-1/3 left-16 w-5 h-5 bg-purple-400/40 rounded-full animate-ping delay-75"></div>
      <div className="absolute top-2/3 right-1/4 w-10 h-10 bg-blue-400/50 rounded-full animate-ping delay-100"></div>
      </section>

      {/* grid */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="flex flex-col gap-16 mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <div>
            {" "}
            <h2 className="text-center text-base/7 font-semibold text-primary">
              build faster
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
              Everything you need to collect & analyze data
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Customer Insights */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <PieChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Academic Insights
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Gain valuable insights from your audience with powerful
                  analytics and reporting tools.
                </p>

                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "0.5rem",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      />
                      <Bar
                        dataKey="responses"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Feature 2: Mobile Friendly */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Mobile Friendly
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Perfect for on-the-go responses with fully responsive forms
                  that work on any device.
                </p>

                <div className="flex justify-center">
                  <div className="relative w-32 h-64 bg-slate-800 rounded-2xl p-2 shadow-lg">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full"></div>
                    <div className="bg-white h-full w-full rounded-lg overflow-hidden">
                      <div className="h-8 bg-blue-500 flex items-center justify-center">
                        <div className="text-white text-xs font-medium">
                          Formlr
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-3/4 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-full bg-blue-100 rounded mb-3 flex items-center px-2">
                          <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
                        </div>
                        <div className="h-8 w-full bg-blue-100 rounded mb-3 flex items-center px-2">
                          <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
                        </div>
                        <div className="h-6 w-1/2 bg-blue-500 rounded mx-auto mt-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Security */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Enhanced Security
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Keep your data safe with enterprise-grade security and GDPR
                  compliance.
                </p>

                <Alert className="border-purple-200 bg-purple-50">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-700 text-sm font-medium">
                    Data Protection
                  </AlertTitle>
                  <AlertDescription className="text-purple-600 text-xs">
                    All form responses are encrypted and securely stored to
                    protect your customers' information.
                  </AlertDescription>
                </Alert>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 mt-1">
                      Encryption
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-1 bg-purple-500"></div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 mt-1">GDPR</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-purple-500"></div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 mt-1">2FA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Beautiful Templates */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <Layout className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Beautiful Templates
                  </h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Start with professionally designed templates to create
                  engaging forms in minutes.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-3 border border-blue-200">
                    <div className="h-2 w-1/2 bg-blue-300 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-blue-200 rounded mb-4"></div>
                    <div className="h-4 w-full bg-white rounded mb-2"></div>
                    <div className="h-4 w-full bg-white rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-blue-400 rounded mt-3 ml-auto"></div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-md p-3 border border-amber-200">
                    <div className="h-2 w-1/2 bg-amber-300 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-amber-200 rounded mb-4"></div>
                    <div className="flex space-x-1 mb-2">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                      <div className="h-4 flex-1 bg-white rounded"></div>
                    </div>
                    <div className="flex space-x-1 mb-2">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                      <div className="h-4 flex-1 bg-white rounded"></div>
                    </div>
                    <div className="h-4 w-1/2 bg-amber-400 rounded mt-3 ml-auto"></div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-3 border border-green-200">
                    <div className="h-2 w-1/2 bg-green-300 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-green-200 rounded mb-4"></div>
                    <div className="h-4 w-full bg-white rounded mb-2 flex items-center px-1">
                      <div className="h-2 w-3/4 bg-green-200 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-white rounded mb-2 flex items-center px-1">
                      <div className="h-2 w-1/2 bg-green-200 rounded"></div>
                    </div>
                    <div className="h-4 w-1/2 bg-green-400 rounded mt-3 ml-auto"></div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-md p-3 border border-purple-200">
                    <div className="h-2 w-1/2 bg-purple-300 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-purple-200 rounded mb-4"></div>
                    <div className="flex space-x-2 mb-2 justify-center">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <div className="h-2 w-3/4 bg-white rounded mb-2 mx-auto"></div>
                    <div className="h-4 w-1/2 bg-purple-400 rounded mt-3 ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Loved by thousands of Academicians
            </h2>
            <p className="text-lg text-primary max-w-2xl mx-auto">
              See what our customers have to say about Formlr.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jane Doe</CardTitle>
                    <CardDescription>
                      Marketing Director, TechCorp
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "Formlr has transformed how we collect customer feedback. The
                  interface is intuitive and the analytics are incredibly
                  insightful."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="font-bold text-primary">MS</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Michael Smith</CardTitle>
                    <CardDescription>HR Manager, GlobalCo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "We use Formlr for all our employee engagement surveys. The
                  team collaboration features are fantastic and have streamlined
                  our process."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="font-bold text-primary">AL</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Alex Lee</CardTitle>
                    <CardDescription>
                      Product Manager, StartupInc
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "The depth of analytics Formlr provides has been crucial for
                  our product development decisions. I can't imagine going back
                  to our old tools."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className=" bg-white mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-primary max-w-2xl mx-auto">
            Choose the plan that's right for you and start collecting valuable
            insights today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className=" border-2 border-primary text-primary bg-transparent shadow-md hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Basic</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-700">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Up to 3 surveys</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>100 responses per survey</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none bg-primary shadow-lg relative">
            <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-slate-200">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Unlimited surveys</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>1,000 responses per survey</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Custom branding</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-primary hover:text-primary hover:bg-white">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-primary text-primary bg-transparent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$39</span>
                <span className="text-slate-700">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Advanced security</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>SSO integration</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start collecting valuable insights?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust Formlr for their feedback and
            research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-purple-50 px-8 py-6 text-lg">
              Start your free trial
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-primary px-8 py-6 text-lg"
            >
              Schedule a demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
