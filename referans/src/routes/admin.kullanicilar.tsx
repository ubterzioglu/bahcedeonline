import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/admin/kullanicilar")({
  component: Users,
});

type RoleRow = { user_id: string; role: "admin" | "staff" };

function Users() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<RoleRow[]>([]);

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("user_id, role");
    setRows((data ?? []) as RoleRow[]);
  };
  useEffect(() => { load(); }, []);

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
        <h1 className="font-display text-xl mb-1">Yetki gerekli</h1>
        <p className="text-xs text-muted-foreground">Bu sayfayı yalnızca admin görebilir.</p>
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
      <h1 className="font-display text-3xl mb-1">Personel</h1>
      <p className="text-xs text-muted-foreground mb-5">
        Yeni personel <a href="/auth" className="text-gold">/auth</a> sayfasından kayıt olabilir.
      </p>

      <div className="space-y-2">
        {Array.from(byUser.entries()).map(([uid, roles]) => {
          const admin = roles.includes("admin");
          return (
            <div key={uid} className="glass-card rounded-2xl p-4">
              <p className="text-foreground/90 font-mono text-[10px] truncate mb-1">{uid}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gold">{admin ? "Admin" : "Personel"}</p>
                <button
                  onClick={() => toggle(uid, !admin)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px]"
                >
                  {admin ? <><ShieldOff className="h-3 w-3" /> Admin'liği kaldır</> : <><Shield className="h-3 w-3" /> Admin yap</>}
                </button>
              </div>
            </div>
          );
        })}
        {byUser.size === 0 && <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">Henüz kayıtlı personel yok.</div>}
      </div>
    </div>
  );
}
