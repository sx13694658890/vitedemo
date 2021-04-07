import React ,{useState,useEffect,useMemo,useContext} from "react"
import {myContext} from "../../App"
const index=()=>{
    const [num,setnum]=useState(0)
    const {state,dispatch}=useContext(myContext)
    const [count,setcount]=useState(()=>{
        return {
            name :num
        }
    })
    const handler=()=>{
        setnum(num+1)
       
    }
    useEffect(()=>{
       
    })
    useMemo(()=>{
        setcount({name:num})
    },[num])
    return (
        <>
        <section style={{margin:"0 auto",width:"500px"}}>
        <h1>案例</h1>
        <p>{count.name}</p>
        <p>{num}</p>
        <i>{state.name}</i>
        <hr/>
        <button onClick={handler}>点击</button>
        </section>
        </>
    )
}
export default index