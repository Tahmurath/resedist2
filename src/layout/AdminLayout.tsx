import { NavLink } from "react-router";
import { Outlet } from "react-router";
import i18n from "i18next";

function AdminLayout() {

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <div>
                <h3>Admin Layout</h3>
                <button onClick={() => changeLanguage('en')}>English</button>
                <button onClick={() => changeLanguage('fa')}>فارسی</button>
                <button onClick={() => changeLanguage('de')}>Deutsch</button>
                <nav>
                    <NavLink to="/" end>Home</NavLink> | <NavLink to="/about" end>About</NavLink>
                    <br/>
                    <NavLink to="/admin" end>admin</NavLink> | <NavLink to="/admin/panel" end>admin panel</NavLink>
                </nav>
                <Outlet/>
            </div>
        </>
    )
}

export default AdminLayout