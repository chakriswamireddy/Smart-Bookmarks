"use client";

import { createClient } from "@/utils/supabase/client";
import ConfirmModal from "../ConfirmModal";
import { useEffect, useState } from "react";

type UserInfo = {
  name: string;
  avatar: string | null;
};

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState<UserInfo | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;

      setUser({
        name:
          data.user.user_metadata.full_name ||
          data.user.user_metadata.name ||
          data.user.email ||
          "User",
        avatar: data.user.user_metadata.avatar_url ?? null,
      });
    });
  }, [supabase]);

  if (!user) return null;

  return (
    <>
      <button
        onClick={toggleOpen}
        className="px-4 py-2 flex items-center gap-4 rounded border border-gray-600 text-sm"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full border flex items-center justify-center text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="text-sm text-gray-300 font-medium truncate max-w-35">
          {user.name}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5z"
          />
          <path
            fill="currentColor"
            d="m20.65 11.65l-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7"
          />
        </svg>
      </button>

      <ConfirmModal
        open={open}
        title="Logout"
        description="Are you sure ??"
        onCancel={toggleOpen}
        onConfirm={handleLogout}
        confirmText="Logout"
      />
    </>
  );
}
