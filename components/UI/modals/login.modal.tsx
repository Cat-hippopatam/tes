"use client";
import CustomModal from "@/components/common/modal";
import LoginForm from "@/forms/auth/login.form";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}
const RegistrationModal = ({ isOpen, onClose }: IProps) => {
    return (

        <CustomModal isOpen={isOpen} onClose={onClose} title="Авторизация"> 
            <LoginForm onClose={onClose} />
        </CustomModal>

    );
};
export default RegistrationModal;

// import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

// export default function CustomModal({ isOpen, onClose, title, children }) {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} placement="center">
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader>{title}</ModalHeader>
//             <ModalBody>
//               {/* LoginForm попадает сюда и будет центрирован внутри окна */}
//                 <CustomModal isOpen={isOpen} onClose={onClose} title="Авторизация"> 
//                     <LoginForm onClose={onClose} />
//                 </CustomModal>
//               {children}
//             </ModalBody>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// }

// export default Modal;


