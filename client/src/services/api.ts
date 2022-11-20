import axios, { CancelToken } from "axios";
import { IResource, INewFilm, INewFilmState } from "../types";

const apiUrl = process.env.REACT_APP_API_URL || '';

console.log('ServerUrl', apiUrl);
export class CancelablePromise<PayloadType> extends Promise<PayloadType> {
  public cancel?: () => void
}

const filmsPath = `${apiUrl}/api/films`;

const axiosClient = axios.create({
  baseURL: apiUrl,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('Unauthorized') && !originalRequest._retry) {
      // originalRequest._retry = true;
      // await refreshAccessTokenFn();
      // return authApi(originalRequest);
    }
    return Promise.reject(error);
  }
);

const fetchApi = {
  fetchFilms: async (): CancelablePromise<IResource[]> => {
    const controller = new AbortController()
    const data: CancelablePromise<IResource[]> = (async () => {
      try {
        const { data } = await axiosClient.get(`${filmsPath}`);
        return data;
      } catch (err) {
        return [];
      }
    })();

    data.cancel = () => controller.abort()

    return data;
  },

  fetchFilm: async (id: string): CancelablePromise<IResource> => {
    const { data } = await axios.get(`${filmsPath}/${id}`);
    return data;
  },

  addFilm: async (film: INewFilm): CancelablePromise<IResource> => {
    const { data } = await axios.post(filmsPath, film);
    return data;
  },

  updateFilm: async (film: IResource): CancelablePromise<IResource> => {
    const { data } = await axios.put(`${filmsPath}/${film.id}`, film);
    return data;
  },

  updateStatus: async (filmState: INewFilmState): CancelablePromise<IResource> => {
    const { data } = await axios.patch(`${filmsPath}/${filmState.id}`, { seen: filmState.status });
    return data;
  },

  deleteFilm: async (id: string): CancelablePromise<IResource> => {
    const { data } = await axios.delete(`${filmsPath}/${id}`);
    return data;
  },
}

export class FetchError<PayloadType> extends Error {
  method: string
  url: string
  status: number
  jsonData: PayloadType

  constructor(method: string, url: string, status: number, jsonData: PayloadType) {
    super("API error")
    this.method = method
    this.url = url
    this.status = status
    this.jsonData = jsonData
  }
}

export { fetchApi };
