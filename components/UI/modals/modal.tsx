"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: IProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200",
        body: "py-6",
        closeButton: "hover:bg-gray-100",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold" style={{ color: "#264653" }}>
            {title}
          </h3>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}