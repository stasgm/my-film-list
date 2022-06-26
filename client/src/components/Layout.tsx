import { ReactNode } from "react"
import { useFilmsCount } from "../queries/queries";

type Props = { children: ReactNode }

const Layout = ({ children }: Props) => {
  const filmCount = useFilmsCount();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-900 pb-44">
        <header className="pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">{`Films: ${filmCount.data} total in base`}</h1>
          </div>
        </header>
      </div>

      <main className="-mt-44 pt-2.5">
        <div className="max-w-7xl mx-auto pb-12 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

export default Layout
