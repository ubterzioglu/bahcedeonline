import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, ShieldOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/kullanicilar")({
  component: UsersPage,
});

type RoleRow = { user_id: string; role: "admin" | "staff" };

function UsersPage() {
  const { locale, dictionary } = useI18n();
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<RoleRow[]>([]);

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("user_id, role");
    setRows((data ?? []) as RoleRow[]);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (userId: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    } else {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    }

    load();
  };

  if (!isAdmin) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <h1 className="mb-1 font-display text-xl">{dictionary.adminPage.userRequired}</h1>
        <p className="text-xs text-muted-foreground">{dictionary.adminPage.usersOnlyAdmin}</p>
      </div>
    );
  }

  const grouped = new Map<string, RoleRow["role"][]>();
  rows.forEach((row) => {
    const list = grouped.get(row.user_id) ?? [];
    list.push(row.role);
    grouped.set(row.user_id, list);
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl">{dictionary.adminPage.users}</h1>
      <p className="mb-5 text-xs text-muted-foreground">
        {dictionary.adminPage.staffSignupHint}{" "}
        <Link to="/$locale/auth" params={{ locale }} className="text-gold">
          /auth
        </Link>
      </p>

      <div className="space-y-2">
        {Array.from(grouped.entries()).map(([userId, roles]) => {
          const admin = roles.includes("admin");

          return (
            <div key={userId} className="glass-card rounded-2xl p-4">
              <p className="mb-1 truncate font-mono text-[10px] text-foreground/90">{userId}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-xs text-gold">
                  {admin ? dictionary.adminUsersPage.admin : dictionary.adminUsersPage.staff}
                </p>
                <button
                  onClick={() => toggle(userId, !admin)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px]"
                >
                  {admin ? (
                    <>
                      <ShieldOff className="h-3 w-3" />
                      {dictionary.adminUsersPage.removeAdmin}
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3" />
                      {dictionary.adminUsersPage.makeAdmin}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {grouped.size === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {dictionary.adminUsersPage.empty}
          </div>
        )}
      </div>
    </div>
  );
}
