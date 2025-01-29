import { useState } from 'react'

const About = () => {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <h3>About page</h3>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        About is {count}
                    </button>
                </div>
            </div>
        </>
    )
}

export default About
