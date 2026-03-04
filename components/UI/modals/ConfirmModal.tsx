"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "danger",
  isLoading = false,
}: IProps) {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case "info":
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
      case "success":
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case "danger":
        return "#DC2626";
      case "warning":
        return "#F59E0B";
      case "info":
        return "#3B82F6";
      case "success":
        return "#10B981";
      default:
        return "#DC2626";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200",
        body: "py-6",
        footer: "border-t border-gray-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex gap-3 items-center">
          {getIcon()}
          <h3 className="text-lg font-semibold" style={{ color: "#264653" }}>
            {title}
          </h3>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            isLoading={isLoading}
            style={{
              backgroundColor: getButtonColor(),
              color: "white",
            }}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}