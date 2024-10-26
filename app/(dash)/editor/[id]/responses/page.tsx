import Header from "@/components/header";
import { getCurrentUser } from "@/utils/jwt";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SendButton } from "../components";
import { getForm } from "../tools";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import React, { Suspense } from "react";
import { db, schema } from "@/utils/db";
import { eq, desc, asc } from "drizzle-orm";
import { BarChart2Icon, Loader2, PieChartIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const userId = await getCurrentUser();
  const form = await getForm(params.id, userId!);
  if (!form) notFound();

  return {
    title: `${form.name} Responses`,
    description: `Responses to the form: ${form.name}`,
    robots: {
      index: false,
      follow: false,
    },
  } satisfies Metadata;
}


export default async function ResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await getCurrentUser();
  const form = await getForm(params.id, userId!);
  if (!form) notFound();

  return (
    <div className="min-h-screen bg-background" vaul-drawer-wrapper="">
      <Header userMenuMargin={false} name={form.name}>
        {/* more buttons */}
        <SendButton formId={form.id}>
          <Button className="ms-auto" variant={"outline"}>Send</Button>
        </SendButton>
      </Header>
      <div className="container lg:max-w-[1250px] pt-5 flex flex-col gap-6 mb-5">
        <Card className="sm:flex sm:justify-between  border-2 border-[#FF4F2F]">
          <div className="flex flex-col gap-1.5 p-6">
            <h1 className="text-2xl font-bold">{form.name}</h1>
            <p className="whitespace-break-spaces">
              View the responses to the form.
            </p>
          </div>

          <CardFooter>
            {/* buttons */}
            <div className="flex gap-4">
              <SendButton formId={form.id}>
                <Button variant="secondary">Share</Button>
              </SendButton>

              <Button variant="secondary" asChild>
                <Link href={`/editor/${form.id}`}>Edit</Link>
              </Button>

              <Button variant="secondary">Settings</Button>
              <Button variant="secondary">Analytics</Button>
            </div>
          </CardFooter>
        </Card>

        <Suspense fallback={<LoadingResponsesList />}>
          <ResponsesList formId={form.id} />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingResponsesList() {
  return (
    // todo: make better loading
    <div className="w-full justify-center items-center flex">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  );
}

async function ResponsesList({ formId }: { formId: string }) {
  const fields = await db.query.formField.findMany({
    where: eq(schema.formField.formId, formId),
    orderBy: asc(schema.formField.index),
  });

  const allResponses = await Promise.all(
    fields.map(async (field) => {
      const responses = await db.query.formSubmissionFieldValue.findMany({
        where: eq(schema.formSubmissionFieldValue.fieldId, field.id),
        columns: {
          value: true,
        },
      });

      return {
        fieldId: field.id,
        fieldName: field.name,
        responses: responses.map((res) => res.value),
      };
    })
  );

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>S/N</th>
            {fields.map((field) => (
              <th key={field.id} className="border px-4 py-2 bg-slate-50">
                {field.name || "Unnamed Field"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allResponses.length > 0 &&
            // Iterate through the number of responses and create a new row for each
            Array.from({
              length: Math.max(...allResponses.map((r) => r.responses.length)),
            }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {allResponses.map(({ responses, fieldId }) => (
                  <td key={fieldId} className="border px-4 py-2">
                    {responses[rowIndex] ? (
                      Array.isArray(responses[rowIndex]) ? (
                        // Handle array of responses
                        responses[rowIndex].map((response, index) => (
                          response.startsWith("/uploads/") || response.startsWith("https://") ? (
                            <React.Fragment key={index}>
                              <a href={response} target="_blank" rel="noopener noreferrer" className="underline font-light">
                                {response} <span className="text-[#FF4F2F]">View File</span>
                              </a>
                              {index < responses[rowIndex].length - 1 && ", "}
                            </React.Fragment>
                          ) : (
                            <React.Fragment key={index}>
                              <span>{response}</span>
                              {index < responses[rowIndex].length - 1 && ", "}
                            </React.Fragment>
                          )
                        ))
                      ) : (
                        // Handle single response
                        typeof responses[rowIndex] === "boolean" ? (
                          <span>{responses[rowIndex] ? "Yes" : "No"}</span>
                        ) : (
                          <span>{responses[rowIndex]}</span>
                        )
                      )
                    ) : (
                      "No response"
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}


async function ResponsesListData({ fieldId }: { fieldId: string }) {
  const responses = await db.query.formSubmissionFieldValue.findMany({
    where: eq(schema.formSubmissionFieldValue.fieldId, fieldId),
    columns: {
      value: true,
    },
  });

  const map = new Map<string, number>();
  for (const response of responses) {
    for (const value of response.value) {
      map.set(value, (map.get(value) || 0) + 1);
    }
  }

  return (
    <ul className="list-disc pl-4 text-sm">
      {/* {Array.from(map).map(([value, count]) => (
                <li key={value}>
                    {value} <span className="text-muted-foreground">({count})</span>
                </li>
            ))} */}

      {Array.from(map).map(([value, count]) => (
        <li key={value}>
          {(value.startsWith("/uploads/") || value.startsWith("https://")) ? ( // Check if value is a file path
            <a href={value} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          ) : (
            value
          )}
          <span className="text-muted-foreground"> ({count})</span>
        </li>
      ))}
    </ul>
  );
}


