"use client";

import { useUser } from "./provider/UserProvider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ToggleMode";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // ✅ useRouter for redirect
import toast from "react-hot-toast";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
}

export const Navbar1 = ({
  logo = { url: "/", src: "/Logo.png", alt: "logo", title: "MediShop" },
  className,
}: NavbarProps) => {
  const { user, setUser, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter(); // ✅ Added for redirect

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      setUser(null);

      // ✅ Sweet toast with success
      toast.success("Logged out successfully 👋", {
        duration: 3000,
        position: "top-right",
      });

      // ✅ Redirect to home page after logout
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const defaultMenu: MenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
  ];

  const authMenu: MenuItem[] = user
    ? [
        ...defaultMenu,
        { title: "Dashboard", url: "/dashboard" },
        { title: "Profile", url: "/profile" },
      ]
    : defaultMenu;

  if (loading)
    return <div className="flex justify-center py-10">Loading...</div>;

  return (
    <section className={cn("py-0.5 px-0", className)}>
      <nav className="hidden lg:flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href={logo.url} className="flex items-center gap-2">
            <Image src={logo.src} width={32} height={32} alt={logo.alt} />
            <span className="text-lg font-semibold">{logo.title}</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {authMenu.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      href={item.url}
                      className={cn(
                        "relative px-4 py-2 transition-all",
                        "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all",
                        "hover:after:w-full",
                        isActive && "font-bold text-red-600 after:w-full"
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <Button size="sm" variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={logo.url}>
            <Image src={logo.src} width={32} height={32} alt={logo.alt} />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>{logo.title}</SheetTitle>
              </SheetHeader>

              <Accordion type="single" collapsible className="mt-4">
                {authMenu.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <AccordionItem key={item.title} value={item.title}>
                      <AccordionTrigger
                        className={cn(isActive && "font-bold text-red-600")}
                      >
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Link
                          href={item.url}
                          className={cn(
                            "block py-1",
                            isActive &&
                              "border-l-4 border-red-500 pl-3 font-semibold text-red-600"
                          )}
                        >
                          {item.title}
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};
