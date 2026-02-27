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