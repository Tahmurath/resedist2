import { useState } from 'react'
import { NavLink } from "react-router";

function Dashboard() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <h3>Dashboard page</h3>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        Dashboard is {count}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Dashboard