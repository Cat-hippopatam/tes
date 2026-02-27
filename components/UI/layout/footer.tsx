import Link from "next/link";
import { siteConfig } from "@/config/site.config";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-8">
                {/* Основная сетка футера */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Колонка 1: О нас */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#457B9D]">
                            {siteConfig.shortTitle}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Образовательная платформа для тех, кто хочет научиться 
                            инвестировать безопасно и с умом.
                        </p>
                    </div>

                    {/* Колонка 2: Навигация */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#457B9D]">
                            Навигация
                        </h3>
                        <ul className="space-y-2">
                            {siteConfig.navItems.map((item) => (
                                <li key={item.href}>
                                    <Link 
                                        href={item.href}
                                        className="text-gray-600 hover:text-[#FFD166] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Колонка 3: Контакты */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#457B9D]">
                            Контакты
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href={`mailto:${siteConfig.contacts.support}`} 
                                   className="hover:text-[#FFD166] transition-colors">
                                    {siteConfig.contacts.support}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${siteConfig.contacts.email}`}
                                   className="hover:text-[#FFD166] transition-colors">
                                    {siteConfig.contacts.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Колонка 4: Соцсети */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#457B9D]">
                            Мы в соцсетях
                        </h3>
                        <div className="flex space-x-4">
                            <a href={siteConfig.socialLinks.telegram} 
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-gray-600 hover:text-[#FFD166] transition-colors">
                                Telegram
                            </a>
                            <a href={siteConfig.socialLinks.vk}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-gray-600 hover:text-[#FFD166] transition-colors">
                                VK
                            </a>
                            <a href={siteConfig.socialLinks.youtube}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-gray-600 hover:text-[#FFD166] transition-colors">
                                YouTube
                            </a>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть футера с копирайтом */}
                <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500 text-sm">
                    <p>© {currentYear} {siteConfig.title}. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;