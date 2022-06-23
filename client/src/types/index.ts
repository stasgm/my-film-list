export interface IFilm {
  id: string;
  name: string;
  url: string;
}

export enum StatusFilter {
  all,
  seen,
  film,
}
