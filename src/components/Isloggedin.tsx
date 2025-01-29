import {Navigate} from "react-router"



const Isloggedin = ({children}:{children:any})=> {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to={'/login'} />
}

export default Isloggedin
