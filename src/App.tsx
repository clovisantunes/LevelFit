import AppRoutes from './routes/Routes';
import { registerSW } from 'virtual:pwa-register'


registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})
function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;