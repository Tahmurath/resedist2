import { useState } from 'react'
import { useTranslation } from "react-i18next";
import {Button} from "@/components/ui/button.tsx";



function Home() {
    const [count, setCount] = useState(0)

    const { t } = useTranslation();


    return (
        <>

            <div>
                <h3>Home page</h3>
                <div className="card">
                    <Button onClick={() => setCount((count) => count + 1)}>
                        Home is {count}
                    </Button>
                    {t("login.description")}
                </div>

            </div>
        </>
    )
}

export default Home