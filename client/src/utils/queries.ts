import { useQuery } from "react-query"
import { IFilm } from "../types";
import fetchApi from '../utils/fetchApi';

const useFilmsQuery = <T>(select: (data: IFilm[]) => T) => useQuery(['films'], fetchApi.fetchFilms, { select });

const useFilmsCount = () => useFilmsQuery((data) => data.length);
const useFilms = () => useFilmsQuery((films) => films.map((film) => ({ name: film.name.toUpperCase().trim(), url: film.url })));
const useFilm = (id: string) => useFilmsQuery((data) => data.find((films) => films.id === id));

export { useFilms, useFilmsCount, useFilm }
