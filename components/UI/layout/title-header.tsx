"use client";

import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";

const TitleHeader = () => {
    const pathname = usePathname();
    const currentNavItem = siteConfig.navItems.find(
        (item) => item.href === pathname
    );

    const pageTitle = currentNavItem ? currentNavItem.label : siteConfig.title;

    return (
        <div className="w-full justify-center mt-6 mb-12">
            <h1 className="text-3x1 font-bold">{pageTitle}</h1>
        </div>
    );
};

export default TitleHeader;