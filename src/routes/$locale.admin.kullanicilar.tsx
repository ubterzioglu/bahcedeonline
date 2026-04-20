import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, ShieldOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/kullanicilar")({
  component: Users,
});

type RoleRow = { user_id: string; role: "admin" | "staff" };

function Users() {
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

  const toggle = async (uid: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
    } else {
      await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
    }
    load();
  };

  if (!isAdmin) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <h1 className="font-display text-xl mb-1">{dictionary.adminPage.userRequired}</h1>
        <p className="text-xs text-muted-foreground">{dictionary.adminPage.usersOnlyAdmin}</p>
      </div>
    );
  }

  const byUser = new Map<string, RoleRow["role"][]>();
  rows.forEach((r) => {
    const arr = byUser.get(r.user_id) ?? [];
    arr.push(r.role);
    byUser.set(r.user_id, arr);
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">{dictionary.adminUsersPage.heading}</h1>
      <p className="text-xs text-muted-foreground mb-5">
        {dictionary.adminPage.staffSignupHint}{" "}
        <Link to="/$locale/auth" params={{ locale }} className="text-gold">
          /auth
        </Link>
      </p>

      <div className="space-y-2">
        {Array.from(byUser.entries()).map(([uid, roles]) => {
          const admin = roles.includes("admin");
          return (
            <div key={uid} className="glass-card rounded-2xl p-4">
              <p className="text-foreground/90 font-mono text-[10px] truncate mb-1">{uid}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gold">
                  {admin ? dictionary.adminUsersPage.admin : dictionary.adminUsersPage.staff}
                </p>
                <button
                  onClick={() => toggle(uid, !admin)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px]"
                >
                  {admin ? (
                    <>
                      <ShieldOff className="h-3 w-3" /> {dictionary.adminUsersPage.removeAdmin}
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3" /> {dictionary.adminUsersPage.makeAdmin}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {byUser.size === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {dictionary.adminUsersPage.empty}
          </div>
        )}
      </div>
    </div>
  );
}
