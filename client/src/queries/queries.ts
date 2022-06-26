import { useMutation, useQuery, useQueryClient } from "react-query"
import { IFilm, INewFilmState } from "../types";
import fetchApi from '../services/api';

const useFilmsQuery = <T>(select: (data: IFilm[]) => T) => useQuery(['films'], fetchApi.fetchFilms, { select });

const useFilmsCount = () => useFilmsQuery((data) => data.length);
const useFilms = () => useFilmsQuery((films) => films);
const useFilm = (id?: string) => useFilmsQuery((data) => data.find((films) => films.id === id));

const useFilmMutations = () => {
  const queryClient = useQueryClient();

  const addFilm = useMutation(
    (film: IFilm) => fetchApi.addFilm(film),
    {
      onMutate: async (film) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('films');

        // Snapshot the previous value
        const previousFilms = queryClient.getQueryData<IFilm[]>('films');

        // Optimistically update to the new value
        if (previousFilms) {
          queryClient.setQueryData<IFilm[]>('films', {
            ...previousFilms,
            ...film
          })
        }

        return { previousFilms }
      }
    }
  );

  const updateFilmStatus = useMutation((filmState: INewFilmState) => fetchApi.updateStatus(filmState.id, filmState.newStatus), {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['todo', { id: variables.id }], data)
    },
  })

  // const updateFilmStatus = useMutation(
  //   ({ id, newStatus }: { id: string, newStatus: boolean }) => fetchApi.updateStatus(id, newStatus),
  //   {
  //     onMutate: async (filmStatus) => {
  //       // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  //       await queryClient.cancelQueries(['films', filmStatus.id]);

  //       // Snapshot the previous value
  //       const previousFilms = queryClient.getQueryData(['films']);
  //       const previousFilms1 = queryClient.getQueryData(['films', { id: filmStatus }]);

  //       // Optimistically update to the new value
  //       if (previousFilms) {
  //         queryClient.setQueryData<IFilm[] | undefined>('films', old => old?.map(i => i.id === filmStatus.id ? { ...i, filmStatus } : i))
  //       }

  //       return { previousFilms }
  //     },
  //     onError: (err, filmStatus, context) => {
  //       queryClient.setQueryData(
  //         "films",
  //         context ? context.previousFilms : context
  //       );
  //     },
  //     onSuccess: (data, filmStatus, context) => {
  //       queryClient.setQueryData(["films", { id: filmStatus.id }], data);
  //       // queryClient.setQueryData<IFilm[] | undefined>('films', old => old?.map(i => i.id === (context?.previousFilms as IFilm).id ? data : i))
  //     },
  //     onSettled: (data) => {
  //       queryClient.invalidateQueries(['films', data?.id]);
  //     },
  //   }
  // );

  return { updateFilmStatus, addFilm };
};

export { useFilms, useFilmsCount, useFilm, useFilmMutations }
