import { useState, useCallback, useEffect, useMemo } from 'react';
import FilmList from './Films';
import FilmDialog from "./FilmDialog";
import SearchPanel from './SearchPanel';
import { Button } from './ButtonGroup';
import { useModal } from "./Modal";

import { lsUtils } from '../utils';
import { ResourceTypeFilter, StatusFilter, } from '../types';
import { useFilmsCount } from '../queries/queries';

// type FilterableFilm = IResource & { lowerCaseTitle: string };

const Layout = () => {
  const filmCount = useFilmsCount();
  const { openModal, closeModal } = useModal();

  const handleOpenAddFilmDialog = useCallback(() => {
    openModal({
      title: "New film",
      component: <FilmDialog onClose={closeModal} />,
    });
  }, [closeModal, openModal]);


  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState(lsUtils.getItem<StatusFilter>('StatusFilter', StatusFilter.watch));

  const [typeFilter, setTypeFilter] = useState(lsUtils.getItem<ResourceTypeFilter>('TypeFilter', ResourceTypeFilter.serial));

  useEffect(() => {
    lsUtils.setItem('StatusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    lsUtils.setItem('TypeFilter', typeFilter);
  }, [typeFilter]);

  const filmsNumberText = useMemo(() => {
    return `Films: ${filmCount?.data ? `${filmCount.data} total in base` : ' -'}`;
  }, [filmCount.data]);

  return (
    <div className="min-h-screen sm:bg-gray-100">
      <header className="bg-green-900 sm:pb-2 sticky top-0 z-30">
        <div id="header">
          <div className="tv:max-w-screen-2xl max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4">
            <div className="flex place-content-between pb-4">
              <h1 className="text-xl sm:text-2xl tv:text-4xl font-bold text-white">
                {filmsNumberText}
              </h1>
              <Button
                className="px-2 py-0 border border-gray-300 text-sm tv:text-lg font-medium text-gray-900 rounded-lg hover:bg-gray-200 bg-gray-100"
                onClick={handleOpenAddFilmDialog}
              >
                Add new film
              </Button>
            </div>
            <SearchPanel
              setSearch={setSearch}
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              setTypeFilter={setTypeFilter}
              typeFilter={typeFilter}
            />
          </div>
        </div>
      </header>

      <main className="sm:pt-4 sm:-mt-2" id="content">
        <div className="tv:max-w-screen-2xl max-w-7xl mx-auto sm:pb-12 sm:px-2 lg:px-8">
          <FilmList search={search} statusFilter={statusFilter} typeFilter={typeFilter} />
        </div>
      </main>
    </div >
  )
}

export default Layout
