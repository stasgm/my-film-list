import { ReactNode, useCallback } from "react"
import { useFilmsCount } from "../queries/queries";
import FilmDialog from "./FilmDialog";
import { Button } from "./ButtonGroup";
import { useModal } from "./Modal";

type Props = { children: ReactNode }

const Layout = ({ children }: Props) => {
  const filmCount = useFilmsCount();
  const { openModal, closeModal } = useModal();

  const handleOpenAddFilmDialog = useCallback(() => {
    openModal({
      title: "New film",
      component: <FilmDialog onClose={closeModal} />,
    });
  }, [closeModal, openModal]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-900 pb-44 sm:pb-32">
        <header className="pt-4 sm:pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 flex place-content-between">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{`Films: ${filmCount.data} total in base`}</h1>
            <Button
              className="px-2 py-0 border border-gray-300 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 bg-gray-100"
              onClick={handleOpenAddFilmDialog}
            >
              Add new film
            </Button>
          </div>
        </header>
      </div >

      <main className="-mt-44 pt-4 sm:pt-3 sm:-mt-32">
        <div className="max-w-7xl mx-auto sm:pb-12 sm:px-2 lg:px-8">{children}</div>
      </main>
    </div >
  )
}

export default Layout
