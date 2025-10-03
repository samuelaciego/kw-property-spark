import { Footer } from "@/components/footer";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AppLayout({ children, showFooter = false }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 sticky top-0 bg-background z-10">
            <SidebarTrigger />
          </header>
          <main className="flex-1">
            {children}
          </main>
          {showFooter && <Footer />}
        </div>
      </div>
    </SidebarProvider>
  );
}