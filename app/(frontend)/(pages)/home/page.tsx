import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { useSignIn } from "../../hooks/useSignIn";
import { redirect } from "next/navigation";
import BookmarkHeader from "../../components/BookmarksHeader";
import BookmarkList from "../../components/BookmarkList";
import RealtimeTest from "../../components/Test";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("session", session);

  if (!session) {
    redirect("/");
  }

  //   const { data: bookmarks } = await supabase
  //     .from('bookmarks2')
  //     .select('*')
  //     .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-800 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <BookmarkHeader />

        <BookmarkList />
        {/* <RealtimeTest /> */}
      </div>
    </main>
  );
}
