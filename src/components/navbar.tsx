"use client";

import { useUser } from "./provider/UserProvider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ToggleMode";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

interface MenuItem { title: string; url: string; }

interface NavbarProps {
  className?: string;
  logo?: { url: string; src: string; alt: string; title: string; };
}

export const Navbar1 = ({ logo = { url: "/", src: "/Logo.png", alt: "logo", title: "MediShop" }, className }: NavbarProps) => {
  const { user, setUser, loading } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      setUser(null); // update UI immediately
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const defaultMenu: MenuItem[] = [{ title: "Home", url: "/" }, { title: "Shop", url: "/shop" }];
  const authMenu: MenuItem[] = user
    ? [...defaultMenu, { title: "Dashboard", url: "/dashboard" }, { title: "Profile", url: "/profile" }]
    : defaultMenu;

  if (loading) return <div className="flex justify-center py-10">Loading...</div>;

  return (
    <section className={cn("py-0.5 pl-5", className)}>
      <div className="container">
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image src={logo.src} width={32} height={32} alt={logo.alt} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {authMenu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink href={item.url} className="px-4 py-2">{item.title}</NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex gap-2 items-center">
            <ModeToggle />
            {user ? (
              <Button size="sm" variant="destructive" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button>
                <Button asChild size="sm"><Link href="/register">Sign up</Link></Button>
              </>
            )}
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url}><Image src={logo.src} width={32} height={32} alt={logo.alt} /></Link>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon"><Menu className="size-4" /></Button></SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>{logo.title}</SheetTitle></SheetHeader>
                <Accordion type="single" collapsible className="mt-4">
                  {authMenu.map((item) => (
                    <AccordionItem key={item.title} value={item.title}>
                      <AccordionTrigger>{item.title}</AccordionTrigger>
                      <AccordionContent><Link href={item.url}>{item.title}</Link></AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 flex flex-col gap-3">
                  {user ? (
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                  ) : (
                    <>
                      <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
                      <Button asChild><Link href="/register">Sign up</Link></Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};
