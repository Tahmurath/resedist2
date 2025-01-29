import { useState } from 'react'
import { useTranslation } from "react-i18next";


function Panel() {
    const [count, setCount] = useState(0)

    const { t } = useTranslation();

    return (
        <>

            <div>
                <h3>Panel page</h3>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        Panel is {count}
                        <br/>
                        {t("login.description")}
                    </button>
                </div>

            </div>
        </>
    )
}

export default Panel