import React, { useState, createContext, useReducer, useEffect } from 'react'
import Demo1 from "./components/demo1"
export const myContext = createContext()
function App() {
  const [count, setcount] = useState(() => {
    return {
      name: "lisi"
    }
  })
  const [state, dispatch] = useReducer((state, { type, payload }) => {
    if (type == "good") {
      console.log(payload)
      return { ...state, name: payload.name }
      return state
    }
    return state
  }, count)
  useEffect(() => {
    dispatch({ type: "good", payload: count })
  }, [count])
  return (
    <>
      <myContext.Provider value={{ state, dispatch }}>
        <Demo1 />
      </myContext.Provider>
      <p>{count.name}</p>
      <button onClick={() => {
        setcount({ name: "zhansdan" })
      }}>按钮</button>
      <button onClick={() => {
        setcount({ name: "张三" })
      }}>reducer</button>
    </>
  )
}

export default App
