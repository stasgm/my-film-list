import { INewFilm, IFilm } from "../types";

const isFilm = (film: INewFilm | IFilm | null | undefined): film is IFilm => {
  return (film as IFilm)?.id !== undefined;
};

export { isFilm }
