import { useState, useCallback, useEffect } from 'react';
import { useAuth0, User } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

import FilmList from './Films';
import FilmDialog from "./FilmDialog";
import SearchPanel from './SearchPanel';
import { useModal } from "./Modal";
import { lsUtils } from '../utils';
import { ResourceTypeFilter, StatusFilter, } from '../types';

const UserPanel = ({ isAuthenticated, user }: { isAuthenticated: boolean, user: User | undefined }) => {
  return (
    <div className={`flex place-content-between ${isAuthenticated ? 'pb-2' : 'pb-0'}`}>
      <h3 className="text-sm sm:text-xl tv:text-xl text-white">
        {user ? <a href="/profile">{user.name}</a> : 'User not logged'}
      </h3>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}

const Layout = () => {
  const { isAuthenticated, user, } = useAuth0();
  const { openModal, closeModal } = useModal();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(lsUtils.getItem<StatusFilter>('StatusFilter', StatusFilter.watch));
  const [typeFilter, setTypeFilter] = useState(lsUtils.getItem<ResourceTypeFilter>('TypeFilter', ResourceTypeFilter.serial));

  const handleOpenAddFilmDialog = useCallback(() => {
    openModal({
      title: "New film",
      component: <FilmDialog onClose={closeModal} type={typeFilter} />,
    });
  }, [closeModal, openModal, typeFilter]);

  useEffect(() => {
    lsUtils.setItem('StatusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    lsUtils.setItem('TypeFilter', typeFilter);
  }, [typeFilter]);

  return (
    <div className="min-h-screen sm:bg-gray-100">
      <header className="bg-green-900 pb-2 sticky top-0 z-30">
        <div id="header">
          <div className="tv:max-w-screen-2xl max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-2">
            <UserPanel isAuthenticated={isAuthenticated} user={user} />
            {isAuthenticated
              ?
              <SearchPanel
                setSearch={setSearch}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                setTypeFilter={setTypeFilter}
                typeFilter={typeFilter}
                addNewFilm={handleOpenAddFilmDialog}
              />
              : null
            }
          </div>
        </div>
      </header>
      <main className="sm:pt-4 sm:-mt-2" id="content">
        <div className="tv:max-w-screen-2xl max-w-7xl mx-auto sm:pb-12 sm:px-2 lg:px-8">
          {isAuthenticated ? (
            <FilmList search={search} statusFilter={statusFilter} typeFilter={typeFilter} />
          ) : (
            <div className="fixed inset-0 w-screen flex items-center justify-center bg-white text-opacity-75 text-gray-600">
              <p>Log in to see your films list</p>
            </div>
          )}
        </div>
      </main>
    </div >
  )
}

export default Layout
