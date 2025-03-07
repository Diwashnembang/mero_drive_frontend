import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Login } from './forms/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-4xl'>
        hello! mero drive
        <Login></Login>
      </div>
    </>
  )
}

export default App
