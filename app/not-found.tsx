"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

const NotFoundPage = () => {

   
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="space-y-6 max-w-md">
                {/* Большая цифра 404 с градиентом */}
                <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-sand-500 bg-clip-text text-transparent">
                    404
                </div>
                
                {/* Иконка или разделитель */}
                <div className="text-6xl text-gray-300">😕</div>
                
                {/* Заголовок */}
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                    Упс! Такой страницы нет...
                </h1>
                
                {/* Описание */}
                <p className="text-gray-500 text-lg">
                    Возможно, она была удалена или вы перешли по неверной ссылке
                </p>
                
                {/* Кнопка с отступами */}
                <div className="pt-8">
                    <Button 
                        as={Link} 
                        color="primary" 
                        variant="shadow" 
                        href="/"
                        size="lg"
                        className="font-medium px-8"
                    >
                        Вернуться на главную
                    </Button>
                </div>
                
                {/* Дополнительные ссылки */}
                <div className="pt-4 text-sm text-gray-400">
                    <Link href="/catalog" className="hover:text-blue-600 transition-colors">
                        Каталог курсов
                    </Link>
                    {" · "}
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">
                        Блог
                    </Link>
                    {" · "}
                    <Link href="/support" className="hover:text-blue-600 transition-colors">
                        Поддержка
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;