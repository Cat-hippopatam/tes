import { FC } from "react";
interface IProps {
    children: React. ReactNode;
}
const CatalogLayout: FC<IProps> = ({ children }) => {
    return <section>{children}</section>;
}
export default CatalogLayout;