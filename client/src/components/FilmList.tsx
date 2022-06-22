import { useMemo } from 'react';
import { useFilms, useFilmsCount } from '../utils/queries';

import '../styles/App.css';

const FilmList = () => {
  const films = useFilms();
  const filmCount = useFilmsCount();

  const formattedList = useMemo(() => {
    if (!films.data) {
      return "no data";
    }

    return films.data.map((el) => {
      return (
        <ul>
          <li><a href={el.url}>{el.name}</a></li>
        </ul>
      )
    })
  }, [films.data]);

  if (films.isLoading) {
    return <div>Loading...</div>
  }

  if (films.isError) {
    return <div>Error! {films.error instanceof Error ? films.error.message : ''}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <p>
          Films: ({filmCount.data || 0})
        </p>
        <p>
          {formattedList}
        </p>
        <></>
      </header>
    </div>
  )
}

export default FilmList;
