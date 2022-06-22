import { QueryClient, QueryClientProvider } from 'react-query'

import FilmList from './FilmList';
import '../styles/App.css';

const queryClient = new QueryClient()


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilmList />
    </QueryClientProvider>
  )
}
