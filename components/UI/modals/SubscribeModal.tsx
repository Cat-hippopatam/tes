"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from "@heroui/react";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import CustomModal from "./modal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: "monthly" | "yearly") => void;
}

export default function SubscribeModal({ isOpen, onClose, onSubscribe }: IProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    monthly: {
      price: 790,
      period: "месяц",
      savings: null,
    },
    yearly: {
      price: 7900,
      period: "год",
      savings: "Скидка 17%",
    },
  };

  const benefits = [
    "Доступ ко всем курсам",
    "Эксклюзивные видеоуроки",
    "Персональные консультации",
    "Дополнительные материалы",
    "Сертификаты об окончании",
  ];

  const handleSubscribe = () => {
    setIsLoading(true);
    // Имитация запроса
    setTimeout(() => {
      if (onSubscribe) onSubscribe(selectedPlan);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Премиум подписка"
      size="lg"
    >
      <div className="flex flex-col gap-6">
        {/* Заголовок с преимуществами */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <SparklesIcon className="w-8 h-8" style={{ color: "#F4A261" }} />
          </div>
          <p className="text-gray-600">
            Откройте все возможности платформы с премиум-подпиской
          </p>
        </div>

        {/* Выбор плана */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            isPressable
            onPress={() => setSelectedPlan("monthly")}
            className={`border-2 ${selectedPlan === "monthly" ? "border-[#F4A261]" : "border-gray-200"}`}
          >
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Ежемесячная</p>
              <p className="text-2xl font-bold" style={{ color: "#264653" }}>
                {plans.monthly.price}₽
              </p>
              <p className="text-sm text-gray-500">в месяц</p>
            </CardBody>
          </Card>

          <Card
            isPressable
            onPress={() => setSelectedPlan("yearly")}
            className={`border-2 ${selectedPlan === "yearly" ? "border-[#F4A261]" : "border-gray-200"} relative`}
          >
            {plans.yearly.savings && (
              <div
                className="absolute -top-2 right-2 text-xs px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: "#2A9D8F" }}
              >
                {plans.yearly.savings}
              </div>
            )}
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Годовая</p>
              <p className="text-2xl font-bold" style={{ color: "#264653" }}>
                {plans.yearly.price}₽
              </p>
              <p className="text-sm text-gray-500">{Math.round(plans.yearly.price / 12)}₽/мес</p>
            </CardBody>
          </Card>
        </div>

        {/* Список преимуществ */}
        <div className="space-y-3">
          <p className="font-medium" style={{ color: "#264653" }}>Что входит:</p>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckIcon className="w-5 h-5 mt-0.5" style={{ color: "#2A9D8F" }} />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onPress={handleSubscribe}
            isLoading={isLoading}
            className="w-full"
            style={{
              backgroundColor: "#F4A261",
              color: "white",
              fontSize: "1.1rem",
              padding: "1.5rem",
            }}
          >
            {isLoading ? "Обработка..." : `Оформить за ${plans[selectedPlan].price}₽`}
          </Button>
          
          <Button variant="light" onPress={onClose} className="w-full">
            Вернуться к бесплатному контенту
          </Button>
        </div>

        <p className="text-xs text-center text-gray-400">
          Подписка автоматически продлевается. Отменить можно в личном кабинете.
        </p>
      </div>
    </CustomModal>
  );
}