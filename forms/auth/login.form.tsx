// "use client";
// import { signInWithCredentials } from "@/actions/sing-in";
// import { Form, Input, Button } from "@heroui/react";
// import { useState } from "react";

// interface IProps {
//   onClose: () => void;
// }

// const LoginForm = ({ onClose }: IProps) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     passwordHash: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);

//     await signInWithCredentials(formData.email, formData.passwordHash)
//     window.location.reload(); // вопрос к этой части на счет авторизации
//     onClose();
//   };

//   return (
//     <Form className="w-full" onSubmit={handleSubmit} validationBehavior="native">
//       <Input
//         isRequired
//         label="Email"
//         labelPlacement="outside"
//         name="email"
//         placeholder="Введите email"
//         type="email"
//         value={formData.email}
//         // Исправлено: classNames вместо className
//         classNames={{
//           inputWrapper: "bg-default-100",
//           input: "text-sm focus:outline-none",
//         }}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         validate={(value) => (!value ? "Email обязателен" : null)}
//       />
//       <Input
//         isRequired
//         label="Пароль"
//         // labelPlacement="outside"
//         name="passwordHash"
//         placeholder="Введите пароль"
//         type="password"
//         value={formData.passwordHash}
//         classNames={{
//           inputWrapper: "bg-default-100",
//           input: "text-sm focus:outline-none",
//         }}
//         onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
//         validate={(value) => (!value ? "Пароль обязателен" : null)}
//       />
//       <div className="flex w-full gap-4 items-center pt-8 justify-end">
//         <Button variant="light" onPress={onClose}>
//           Отмена
//         </Button>
//         <Button color="primary" type="submit">
//           Войти
//         </Button>
//       </div>
//     </Form>
//   );
// };

"use client";
import { signInWithCredentials } from "@/actions/sing-in";
import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Импортируем роутер

interface IProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   await signInWithCredentials(formData.email, formData.passwordHash);
    
    // Вместо reload() обновляем данные и закрываем модалку
    router.refresh(); 
    onClose();
  };

  return (
    /* Убрали z-50 и ограничение ширины, чтобы ModalBody сам управлял формой */
    <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} validationBehavior="native">
      <Input
        isRequired
        label="Email"
        labelPlacement="outside"
        placeholder="Введите email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        isRequired
        label="Пароль"
        labelPlacement="outside"
        placeholder="Введите пароль"
        type="password"
        value={formData.passwordHash}
        onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
      />
      <div className="flex w-full gap-2 items-center pt-4 justify-end">
        <Button variant="flat" onPress={onClose}>
          Отмена
        </Button>
        <Button color="primary" type="submit">
          Войти
        </Button>
      </div>
    </Form>
  );
};


export default LoginForm;
