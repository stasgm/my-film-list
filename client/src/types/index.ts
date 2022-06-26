export interface IFilm {
  id: string;
  name: string;
  url: string;
  seen?: boolean;
}

export interface INewFilm extends Omit<IFilm, 'id'> {
  id?: string;
};

export interface INewFilmState { id: string, newStatus: boolean };

export enum StatusFilter {
  all,
  seen,
  film,
}
