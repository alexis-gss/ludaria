"use client";

import { motion } from "framer-motion";
import { CalendarDays, RefreshCw } from "lucide-react";
import { useState } from "react";

import type { ReactNode} from "react";

import FormData from "@/components/profile/FormData";
import FormDelete from "@/components/profile/FormDelete";
import FormPassword from "@/components/profile/FormPassword";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/UserProvider";
import { useFormatedDate } from "@/hooks/use-formated-value";
import { cn } from "@/lib/utils";


type TabsType = {
  value: string;
  label: string;
  component: () => ReactNode | null;
}[];

export default function ProfilePage() {
  const { user } = useUser();

  const tabs = [
    { value: "general", label: "Général", component: FormData },
    { value: "password", label: "Mot de passe", component: FormPassword },
    { value: "logout", label: "Zone de danger", component: FormDelete },
  ] as TabsType;

  // État pour gérer la tab active pour l’animation
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const userCreatedAt = user?.createdAt
    ? new Date(user?.createdAt)
    : new Date();
  const userUpdatedAt = user?.updatedAt
    ? new Date(user?.updatedAt)
    : new Date();

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-6 pt-18">
      {/* INTRO */}
      <section className="text-center md:text-start pt-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Paramètres du profil
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto md:ms-0">
          Gérez les informations de votre compte personnel.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto md:ms-0">
          Vous pouvez ici modifier votre <strong>pseudo</strong> et votre{" "}
          <strong>email</strong>, mettre à jour votre{" "}
          <strong>mot de passe</strong>, ou{" "}
          <strong>supprimer définitivement</strong> votre compte si vous le
          souhaitez.
        </p>
        {/* DATES */}
        <Card className="flex flex-col md:flex-row md:items-center gap-4 bg-muted/30 border border-border/50 rounded-xl p-4 mt-4 mx-auto md:ms-0 w-fit">
          <div className="flex justify-center md:justify-start items-center gap-2">
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
            <span className="text-start text-sm text-muted-foreground">
              Membre depuis le{" "}
              <strong>{useFormatedDate(userCreatedAt.toString())}</strong>
            </span>
          </div>
          <div className="hidden md:block w-px h-5 bg-border" />
          <div className="flex justify-center md:justify-start items-center gap-2">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
            <span className="text-start text-sm text-muted-foreground">
              Dernière mise à jour le{" "}
              <strong>{useFormatedDate(userUpdatedAt.toString())}</strong>
            </span>
          </div>
        </Card>
      </section>
      {/* TABS */}
      <Tabs
        defaultValue={tabs[0].value}
        orientation="vertical"
        className="flex flex-col md:flex-row w-full mt-6 md:items-stretch md:h-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="border-b md:border-b-0 md:border-e md:mr-6 md:pr-6 pb-6 mb-6 md:pb-0 md:mb-0">
          <TabsList className="flex flex-col md:w-60 w-full md:items-start md:justify-start rounded-none gap-y-1 bg-transparent h-fit p-0">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                className="cursor-pointer dark:text-white hover:dark:bg-opacity-100 transition-all duration-300"
                variant="ghost"
                asChild
              >
                <TabsTrigger
                  className={cn(
                    "w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-auto",
                    {
                      "hover:text-red-800! data-[state=active]:text-red-800! data-[state=active]:border-red-800!":
                        tab.value === tabs[tabs.length - 1].value,
                    }
                  )}
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              </Button>
            ))}
          </TabsList>
        </div>
        {/* CONTENU DES TABS AVEC ANIMATION */}
        <div className="flex-1">
          {tabs.map(
            (tab) =>
              tab.value === activeTab && (
                <TabsContent key={tab.value} value={tab.value} asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <tab.component />
                  </motion.div>
                </TabsContent>
              )
          )}
        </div>
      </Tabs>
    </div>
  );
}
