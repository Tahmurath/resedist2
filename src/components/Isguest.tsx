import {Navigate} from "react-router"
import {getAuthToken} from "@/services/authService.ts";



const Isguest = ({children}:{children:any})=> {
    const token = getAuthToken()
    return token ? <Navigate to={'/admin'} /> : children
}

export default Isguest
