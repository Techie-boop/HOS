import { getSessionUser } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <header className="border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-900">
          Console Settings
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your personal organiser details, organization settings, and account password.
        </p>
      </header>

      {/* Profile Form */}
      <SettingsForm
        initialData={{
          fullName: user.fullName,
          designation: user.designation,
          organizationName: user.organizationName,
          phone: user.phone,
          website: user.website,
        }}
      />
    </main>
  );
}
