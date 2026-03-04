"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Chip } from "@heroui/react";
import { HeartIcon, FolderIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import CustomModal from "./modal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  contentTitle?: string;
  onSave?: (data: { collection: string; note: string }) => void;
}

export default function FavoriteModal({
  isOpen,
  onClose,
  contentTitle = "Материал",
  onSave,
}: IProps) {
  const [selectedCollection, setSelectedCollection] = useState("default");
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [newCollection, setNewCollection] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);

  // Пример коллекций пользователя
  const collections = [
    { id: "default", name: "Общее", count: 12 },
    { id: "investments", name: "Инвестиции", count: 5 },
    { id: "retirement", name: "Пенсия", count: 3 },
    { id: "taxes", name: "Налоги", count: 2 },
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({
        collection: selectedCollection === "new" ? newCollection : selectedCollection,
        note,
      });
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Сохранить в избранное"
      size="md"
    >
      <div className="flex flex-col gap-5">
        {/* Информация о материале */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <HeartIcon className="w-5 h-5" style={{ color: "#F4A261" }} />
          <span className="text-sm text-gray-700 line-clamp-1">{contentTitle}</span>
        </div>

        {/* Выбор коллекции */}
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "#264653" }}>
            Коллекция
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {collections.map((collection) => (
              <Chip
                key={collection.id}
                variant={selectedCollection === collection.id ? "solid" : "light"}
                className="cursor-pointer"
                style={{
                  backgroundColor: selectedCollection === collection.id ? "#2A9D8F" : undefined,
                  color: selectedCollection === collection.id ? "white" : undefined,
                }}
                onClick={() => setSelectedCollection(collection.id)}
              >
                {collection.name} ({collection.count})
              </Chip>
            ))}
            <Chip
              variant={showNewCollection ? "solid" : "light"}
              className="cursor-pointer"
              style={{
                backgroundColor: showNewCollection ? "#F4A261" : undefined,
                color: showNewCollection ? "white" : undefined,
              }}
              onClick={() => setShowNewCollection(!showNewCollection)}
              startContent={<PlusIcon className="w-3 h-3" />}
            >
              Новая
            </Chip>
          </div>

          {/* Поле для новой коллекции */}
          {showNewCollection && (
            <Input
              placeholder="Название новой коллекции"
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              className="mt-2"
              size="sm"
            />
          )}
        </div>

        {/* Заметка */}
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "#264653" }}>
            Заметка (необязательно)
          </p>
          <Input
            placeholder="Например: интересный материал про ETF"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Кнопки */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onPress={handleSave}
            disabled={isSaved}
            className="w-full"
            style={{
              backgroundColor: "#F4A261",
              color: "white",
            }}
            startContent={isSaved ? <CheckIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
          >
            {isSaved ? "Сохранено!" : "Сохранить"}
          </Button>
          
          <Button variant="light" onPress={onClose} className="w-full">
            Отмена
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
