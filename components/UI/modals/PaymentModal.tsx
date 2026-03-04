"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Card, CardBody, Radio, RadioGroup } from "@heroui/react";
import { CreditCardIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import CustomModal from "./modal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description?: string;
  onSuccess?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  description = "Оплата подписки",
  onSuccess,
}: IProps) {
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleSubmit = () => {
    setStep("processing");
    
    // Имитация обработки платежа
    setTimeout(() => {
      // 90% успеха для тестирования
      if (Math.random() > 0.1) {
        setStep("success");
        if (onSuccess) onSuccess();
      } else {
        setStep("error");
      }
    }, 2000);
  };

  const resetModal = () => {
    setStep("form");
    setCardData({ number: "", expiry: "", cvc: "", name: "" });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Оплата"
      size="md"
    >
      {step === "form" && (
        <div className="flex flex-col gap-5">
          {/* Информация о платеже */}
          <Card className="bg-gray-50">
            <CardBody className="text-center">
              <p className="text-sm text-gray-600">{description}</p>
              <p className="text-3xl font-bold" style={{ color: "#264653" }}>
                {amount} ₽
              </p>
            </CardBody>
          </Card>

          {/* Способ оплаты */}
          <RadioGroup
            label="Способ оплаты"
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <Radio value="card" description="Банковская карта">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                <span>Карта</span>
              </div>
            </Radio>
            <Radio value="sbp" description="Система быстрых платежей">
              <div className="flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5" />
                <span>СБП</span>
              </div>
            </Radio>
          </RadioGroup>

          {/* Форма для карты (только для демонстрации) */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <Input
                label="Номер карты"
                placeholder="4242 4242 4242 4242"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                startContent={<CreditCardIcon className="w-4 h-4 text-gray-400" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ММ/ГГ"
                  placeholder="12/25"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  type="password"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                />
              </div>
              <Input
                label="Имя на карте"
                placeholder="IVAN PETROV"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
            </div>
          )}

          {/* Для СБП - упрощенно */}
          {paymentMethod === "sbp" && (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-gray-600">Выберите банк в приложении</p>
                <p className="text-sm text-gray-400 mt-2">(тестовая имитация)</p>
              </CardBody>
            </Card>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onPress={handleSubmit}
              className="w-full"
              style={{
                backgroundColor: "#F4A261",
                color: "white",
              }}
            >
              Оплатить {amount} ₽
            </Button>
            <Button variant="light" onPress={handleClose} className="w-full">
              Отмена
            </Button>
          </div>

          <p className="text-xs text-center text-gray-400">
            Это тестовая оплата. Реальные платежи не выполняются.
          </p>
        </div>
      )}

      {/* Процессинг */}
      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: "#F4A261" }} />
          <p className="text-lg font-medium" style={{ color: "#264653" }}>Обработка платежа</p>
          <p className="text-sm text-gray-500 mt-2">Пожалуйста, подождите...</p>
        </div>
      )}

      {/* Успех */}
      {step === "success" && (
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircleIcon className="w-16 h-16 mb-4" style={{ color: "#2A9D8F" }} />
          <p className="text-lg font-medium" style={{ color: "#264653" }}>Оплата прошла успешно!</p>
          <p className="text-sm text-gray-500 mt-2">Спасибо за покупку</p>
          <Button
            onPress={handleClose}
            className="w-full mt-6"
            style={{
              backgroundColor: "#2A9D8F",
              color: "white",
            }}
          >
            Закрыть
          </Button>
        </div>
      )}

      {/* Ошибка */}
      {step === "error" && (
        <div className="flex flex-col items-center justify-center py-8">
          <XCircleIcon className="w-16 h-16 mb-4 text-red-500" />
          <p className="text-lg font-medium" style={{ color: "#264653" }}>Ошибка оплаты</p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Попробуйте другой способ оплаты или повторите попытку позже
          </p>
          <div className="flex gap-3 w-full mt-6">
            <Button
              onPress={() => setStep("form")}
              variant="light"
              className="flex-1"
            >
              Назад
            </Button>
            <Button
              onPress={handleClose}
              className="flex-1"
              style={{
                backgroundColor: "#F4A261",
                color: "white",
              }}
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </CustomModal>
  );
}
