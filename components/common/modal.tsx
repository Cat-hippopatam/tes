"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"; 
import { ReactNode } from "react";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    // Исправлено: "xl" вместо "x1"
    size?: "xs" | "sm" | "md" | "lg" | "xl"; 
}

const CustomModal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md" // "xs" для формы логина может быть слишком узким
}: IProps) => {

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size={size}
            placement="center" // Гарантирует центровку по вертикали и горизонтали
            backdrop="blur"    // Затемнение фона поможет увидеть окно
        >
            <ModalContent>
                <ModalHeader className="border-b">
                    {/* Убрали text-background, чтобы текст был виден (черным в светлой теме) */}
                    <h3 className="text-xl font-semibold">{title}</h3> 
                </ModalHeader>
                <ModalBody className="py-6">
                    {children}
                </ModalBody> 
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;
