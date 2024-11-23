// Components
import Navbar from 'components/Navbar'
import Router from '@/Router'
import {useRedirectIfDevToolsOpen} from "./hooks/useRedirectIfDevToolsOpen";

function App() {
useRedirectIfDevToolsOpen()

  return (
    <div className='relative'>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <Router />
    </div>
  )
}

export default App
