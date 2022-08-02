import { ButtonHTMLAttributes, cloneElement, ReactElement } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }

export const Button = ({ active, ...htmlAttributes }: ButtonProps): JSX.Element => (
  <button tabIndex={active ? -1 : undefined} type="button" {...htmlAttributes} />
)

type ButtonGroupProps = { children: ReactElement[] }

const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => {
  return (
    <div className="relative z-0 inline-flex shadow-sm rounded-md w-auto sm:grow-0 grow sm:mr-0 mr-3">
      <span className="flex w-full">
        {children.map((child, index) => {
          const isFirst = index === 0
          const isLast = index === children.length - 1
          const isMiddle = !isFirst && !isLast
          return cloneElement(child, {
            className: `
            ${child.props.className}
            relative inline-flex items-center px-4 py-2
            border border-gray-300
            text-sm font-medium text-gray-700
            justify-center
            grow
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
            ${isFirst ? "rounded-l-md" : isMiddle ? "-ml-px" : isLast ? "-ml-px rounded-r-md" : ""}
            ${child.props.active
                ? "z-10 bg-indigo-50 outline-none ring-1 ring-indigo-500 border-indigo-500 hover:bg-indigo-150"
                : "bg-white hover:bg-gray-200"
              }
          `,
            key: child.props.key || index,
          })
        })}
      </span>
    </div>
  )
}

ButtonGroup.Button = Button

export default ButtonGroup
