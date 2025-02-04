import {Navigate} from "react-router"
import {getAuthToken} from "@/services/authService.ts";



const Isloggedin = ({ children }: { children: any }) => {
    const token = getAuthToken();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>; // فقط زمانی که کاربر لاگین کرده باشد
};

export default Isloggedin
