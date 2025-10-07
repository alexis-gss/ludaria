import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

export default async function AccountDeletedPage() {
  const cookieStore = await cookies();
  const flag = cookieStore.get("account_deleted");
  if (!flag) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Account deleted
        </h1>
        <p className="mb-6 text-muted-foreground">
          Your account has been successfully deleted. All associated data has
          been erased.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button
              className="cursor-pointer dark:text-white hover:dark:bg-opacity-100 transition-all duration-300"
              variant="ghost"
            >
              Return to homepage
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              className="cursor-pointer dark:text-white hover:dark:bg-opacity-100 transition-all duration-300"
              variant="ghost"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
