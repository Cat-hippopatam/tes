"use client";

import { siteConfig } from "@/config/site.config";
import { 
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    Button,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import  RegistrationModal  from "@/components/UI/modals/registartion.modal";
import  LoginModal  from "@/components/UI/modals/login.modal";

export const Logo = () => {
    return (
        <div className="relative w-[30px] h-[30px]">
            <Image 
                src="/logo.png" 
                alt={siteConfig.shortTitle || siteConfig.title}
                fill
                sizes="30px"
                priority
                className="object-contain"
            />
        </div>
    );
};

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false); 
    const [isLoginOpen, setIsLoginOpen]=useState(false);

    // Функция для проверки активного пункта меню (учитывает вложенные пути)
    const isActiveRoute = (href: string) => {
        if (href === '/') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const getNavItems = () => {
        return siteConfig.navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
                <NavbarItem key={item.href}>
                    <Link 
                        href={item.href}
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive 
                                ? "text-[#FFD166] font-medium" 
                                : "text-gray-600 hover:text-[#457B9D]"
                        } hover:bg-gray-50`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                </NavbarItem>
            );
        });
    };

    // Мобильное меню
    const getMobileNavItems = () => {
        return siteConfig.navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
                <NavbarMenuItem key={item.href}>
                    <Link 
                        href={item.href}
                        className={`w-full block px-4 py-3 rounded-md transition-all duration-200 ${
                            isActive 
                                ? "text-[#FFD166] bg-gray-50 font-medium" 
                                : "text-gray-600 hover:text-[#457B9D] hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                </NavbarMenuItem>
            );
        });
    };

    return (
        <Navbar 
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            className="bg-dark/80 backdrop-blur-md border-b border-gray-200"
            position="sticky"
        >
            {/* Левая часть - Логотип и бренд */}
            <NavbarBrand>
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    <p className="font-bold text-xl" style={{ color: siteConfig.theme.primary }}>
                        {siteConfig.shortTitle || "Экономикус"}
                    </p>
                </Link>
            </NavbarBrand>

            {/* Кнопка мобильного меню */}
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
            />

            {/* Десктопное меню */}
            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                {getNavItems()}
            </NavbarContent>

            {/* Правая часть - Кнопки входа/регистрации */}
            <NavbarContent justify="end" className="hidden sm:flex">
                <NavbarItem>
                    <Button
                        color="secondary"
                        variant="flat"
                        onPress={() => setIsLoginOpen(true)} // Теперь сработает чисто
                        style={{ borderColor: siteConfig.theme.primary }}
                    >
                        Логин 
                    </Button>
                </NavbarItem>

                <NavbarItem>
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={() => setIsRegistrationOpen(true)}
                        style={{ 
                            backgroundColor: siteConfig.theme.accent,
                            color: '#1F2937'
                        }}
                        className="font-medium hover:opacity-90 transition-opacity"
                    >
                        Регистрация
                    </Button>
                </NavbarItem>

            </NavbarContent>

            

            {/* Мобильное меню */}
            <NavbarMenu className="pt-6">
                {/* Кнопки входа/регистрации для мобильных */}
                <div className="flex gap-2 mb-4 px-4">
                    <Button
                        as={Link} color="secondary"
                        href="#"
                        variant="flat"
                        onPress={() => setIsLoginOpen(true)}
                        style={{ borderColor: siteConfig.theme.primary }}
                        >
                        Логин 
                        
                        </Button>
                    {/* <Button 
                        as={Link}
                        href="/auth/login"
                        variant="bordered"
                        className="flex-1"
                        style={{ borderColor: siteConfig.theme.primary }}
                    >
                        Вход
                    </Button> */}
                    <Button
                    as={Link} color="primary" href="#"
                    variant="flat"
                    onPress={() => setIsRegistrationOpen(true)}
                    style={{ 
                            backgroundColor: siteConfig.theme.accent,
                            color: '#1F2937'
                        }}
                        className="flex-1 font-medium"
                    >
                    Регистрация
                    </Button>
                    {/* <Button 
                        as={Link}
                        href="/auth/register"
                        style={{ 
                            backgroundColor: siteConfig.theme.accent,
                            color: '#1F2937'
                        }}
                        className="flex-1 font-medium"
                    >
                        Регистрация
                    </Button> */}
                </div>

                {/* Навигация в мобильном меню */}
                <div className="flex flex-col gap-1">
                    {getMobileNavItems()}
                </div>
            </NavbarMenu>

            <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </Navbar>

        
    );
}