"use client";

import { CreditCard, Layers, Users } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/primitives";
import { usePlans, useSubscriptions, useUsers } from "@/lib/queries";
import { PlansTab } from "./plans-tab";
import { SubscriptionsTab } from "./subscriptions-tab";
import { UsersTab } from "./users-tab";

function Count({ value }: { value: number | undefined }) {
  if (value === undefined) return null;
  return <span className="rounded-full bg-current/10 px-1.5 font-mono text-[11px]">{value}</span>;
}

export function AdminScreen() {
  const plans = usePlans();
  const users = useUsers();
  const subs = useSubscriptions();

  return (
    <>
      <PageHeading
        eyebrow="Administrare"
        title="Planuri, utilizatori, abonamente"
        description="Tot ce se poate face acum prin API-ul Pocketrip."
      />
      <Tabs defaultValue="planuri">
        <TabsList className="mb-6 bg-ink/[0.08] text-ink">
          <TabsTrigger value="planuri">
            <Layers /> Planuri <Count value={plans.data?.length} />
          </TabsTrigger>
          <TabsTrigger value="utilizatori">
            <Users /> Utilizatori <Count value={users.data?.length} />
          </TabsTrigger>
          <TabsTrigger value="abonamente">
            <CreditCard /> Abonamente <Count value={subs.data?.length} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="planuri" className="outline-none">
          <PlansTab />
        </TabsContent>
        <TabsContent value="utilizatori" className="outline-none">
          <UsersTab />
        </TabsContent>
        <TabsContent value="abonamente" className="outline-none">
          <SubscriptionsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
