import axios from "axios";
import { IFilm } from "../types";


const fetchApi = {
  fetchFilms: async (): Promise<IFilm[]> => {
    const { data } = await axios.get('/api/list');
    return data;
  },
  fetchFilm: async (): Promise<IFilm> => {
    const { data } = await axios.get('/api/list/:id');
    return data;
  }
}

export default fetchApi;
