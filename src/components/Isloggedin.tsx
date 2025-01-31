import {Navigate} from "react-router"
import {getAuthToken} from "@/services/authService.ts";



const Isloggedin = ({children}:{children:any})=> {
    const token = getAuthToken()
    return token ? children : <Navigate to={'/login'} />
}

export default Isloggedin
