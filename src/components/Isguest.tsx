import {Navigate} from "react-router"



const Isguest = ({children}:{children:any})=> {
    const token = localStorage.getItem('token')
    return token ? <Navigate to={'/login'} /> : children
}

export default Isguest
