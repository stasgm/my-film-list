import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import FilmList from './Films';
import Layout from './Layout';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <FilmList />
      </Layout>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  )
}
