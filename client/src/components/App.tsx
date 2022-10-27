import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query/devtools";
import FilmList from './Films';
import Layout from './Layout';
import { ModalProvider } from './Modal';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Layout>
          <FilmList />
        </Layout>
      </ModalProvider>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}
