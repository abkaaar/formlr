"use client";
import { updateFormSettings } from "@/actions/form-settings";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import CopyButton from "@/components/copy-button.client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseUrl } from "@/utils/const";
import {
  BarChart2,
  CopyIcon,
  FileText,
  LayoutDashboard,
  Menu,
  Send,
  Settings,
  Users,
  X,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export function SendButton({
  children,
  formId,
}: PropsWithChildren<{ formId: string }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            <Input id="link" defaultValue={`${baseUrl}/f/${formId}`} readOnly />
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
  );
}

export function SettingsButton({
  formId,
  initialAccepting,
  children,
}: PropsWithChildren<{ formId: string; initialAccepting: boolean }>) {
  const [acceptingResponses, setAcceptingResponses] =
    useState(initialAccepting);
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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



// Sidebar
export function FormSidebar({
  formId,
  initialAccepting,
  activeTab,
}: {
  formId: string;
  initialAccepting: boolean;
  activeTab?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define sidebar tabs
  const tabs = [
    {
      id: "edit",
      label: "Edit Form",
      icon: <FileText size={20} />,
      href: `/editor/${formId}`,
    },
    {
      id: "responses",
      label: "Responses",
      icon: <Users size={20} />,
      href: `/editor/${formId}/responses`,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart2 size={20} />,
      href: `/forms/${formId}/analytics`,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Toggle Button */}
      <div className="flex items-center p-4 fixed z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-indigo-600 text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <LayoutDashboard size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="mt-5 w-40 rounded-xl bg-indigo-700 text-white transition-all duration-300 ease-in-out fixed top-28 h-screen z-40">
          <nav className="mt-6 px-2">
            {/* Dashboard link */}
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isActive={false}
              href="/dashboard"
            />

            {/* Form specific tabs */}
            {tabs.map((tab) => (
              <SidebarItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                href={tab.href}
              />
            ))}

            {/* Share Form */}
            <div className="mt-6">
              <SendButton formId={formId}>
                <SidebarItem
                  icon={<Send size={20} />}
                  label="Share Form"
                  isActive={false}
                  isButton
                />
              </SendButton>
            </div>

            {/* Settings */}
            <div>
              <SettingsButton
                formId={formId}
                initialAccepting={initialAccepting}
              >
                <SidebarItem
                  icon={<Settings size={20} />}
                  label="Settings"
                  isActive={false}
                  isButton
                />
              </SettingsButton>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  isActive,
  href,
  onClick,
  isButton = false,
}: {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
  isButton?: boolean;
}) {
  const itemContent = (
    <div
      className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-800 text-white"
          : "text-indigo-100 hover:bg-indigo-600"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="ml-3">{label}</span>
    </div>
  );

  if (isButton) {
    return (
      <button onClick={onClick} className="w-full">
        {itemContent}
      </button>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full">
        {itemContent}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className="w-full">
      {itemContent}
    </Link>
  );
}
