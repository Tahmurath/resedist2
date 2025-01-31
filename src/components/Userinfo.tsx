import {Navigate} from "react-router"
import {getUser} from "@/services/authService.ts";




const Userinfo = ({children}:{children:any})=> {
    const token = getUser()
    return token ? children : <Navigate to={'/login'} />
}

export default Userinfo
