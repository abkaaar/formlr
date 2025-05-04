"use client";
import { updateFormSettings } from "@/actions/form-settings";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import CopyButton from "@/components/copy-button.client";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseUrl } from "@/utils/const";
import { CopyIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export function SendButton({ children, formId }: PropsWithChildren<{ formId: string }>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send survey</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to submit responses.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={`${baseUrl}/f/${formId}`}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" asChild>
                        <CopyButton text={`${baseUrl}/f/${formId}`}>
                            <span className="sr-only">Copy</span>
                            <CopyIcon className="h-4 w-4" />
                        </CopyButton>
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function SettingsButton({ formId, initialAccepting }: { formId: string; initialAccepting: boolean }) {
    const [acceptingResponses, setAcceptingResponses] = useState(initialAccepting);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleToggle = async () => {
      startTransition(async () => {
        console.log("Before toggle:", acceptingResponses); // Log state before toggle
        const updated = await updateFormSettings(formId, !acceptingResponses);
        console.log("Updated state:", updated.acceptingResponses); // Log backend response
        setAcceptingResponses(updated.acceptingResponses);
        router.refresh(); // Refresh the page to reflect changes
      });
    };
    
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Settings</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Form Settings</DialogTitle>
            <DialogDescription>
              Toggle whether this form should continue receiving responses.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between py-4">
            <Label htmlFor="toggle-accept">Accepting responses</Label>
            <Switch
              id="toggle-accept"
              checked={acceptingResponses}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }