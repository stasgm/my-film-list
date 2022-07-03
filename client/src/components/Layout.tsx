import { ReactNode, useState } from "react"
import { useFilmMutations, useFilmsCount } from "../queries/queries";
import { IFilm, INewFilm } from "../types";
import { Button } from "./ButtonGroup";
import FilmDialog from "./FilmDialog";
import { useModal } from "./Modal";

type Props = { children: ReactNode }

const Layout = ({ children }: Props) => {
  const filmCount = useFilmsCount();
  const { setModal } = useModal();
  const mutation = useFilmMutations();

  const initialState: IFilm = {
    id: "",
    seen: false,
    name: '',
    url: '',
  };

  const [film, setFilm] = useState<IFilm>(initialState);

  const handlePostFilm = () => {

  };

  const handleAddFilm = () => {
    setModal({
      title: "New film",
      content: <FilmDialog film={film} setFilm={setFilm} />,
      onOk: handlePostFilm
    });

    // const film = films.data?.find(el => el.id === id);

    // setSelctedFilm(film || null);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-900 pb-44 sm:pb-32">
        <header className="pt-4 sm:pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex place-content-between">
            <h1 className="text-xl sm:text-4xl font-bold text-white">{`Films: ${filmCount.data} total in base`}</h1>
            <Button
              className="px-2 py-0 border border-gray-300 text-sm  font-medium text-gray-700 rounded-lg hover:bg-gray-200 bg-gray-100"
              onClick={handleAddFilm}
            >
              Add new film
            </Button>
            {/* </div> */}
          </div>
        </header>
      </div >

      <main className="-mt-44 pt-4 sm:pt-3 sm:-mt-32">
        <div className="max-w-7xl mx-auto pb-12 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div >
  )
}

export default Layout
