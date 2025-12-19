import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ClientsManager from "@/components/admin/ClientsManager";
import ContactsViewer from "@/components/admin/ContactsViewer";
import SubscribersViewer from "@/components/admin/SubscribersViewer";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Admin Panel
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-muted p-1">
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              Projects
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              Clients
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
              Subscribers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="animate-fade-in">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="clients" className="animate-fade-in">
            <ClientsManager />
          </TabsContent>

          <TabsContent value="contacts" className="animate-fade-in">
            <ContactsViewer />
          </TabsContent>

          <TabsContent value="subscribers" className="animate-fade-in">
            <SubscribersViewer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
