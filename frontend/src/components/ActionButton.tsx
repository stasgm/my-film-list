import { ReactElement, SVGProps } from "react";

type ActionButtonProps = SVGProps<SVGSVGElement> & { children: ReactElement, active?: boolean };

const ActionButton = ({ children, active, ...htmlAttributes }: ActionButtonProps): JSX.Element => (
  <svg className={`cursor-pointer h-8 w-8 rounded-full stroke-2 stroke-current p-1 hover:text-green-600 ${active ? "bg-green-300" : "hover:bg-gray-100"}`} fill="none" viewBox="0 0 24 24" {...htmlAttributes}>
    {children}
  </svg>
)

export default ActionButton;
