import { Button } from 'antd'
import './animation.css'
import { useState } from 'react'

const ButtonAnimation = () => {
    const [isClicked, setIsClicked] = useState(false)
    return (
        <div className={`button-animation-container ${isClicked ? 'clicked' : ''}`}>
            <Button type="primary" className="button-animation" onClick={() => {
                setIsClicked(true)
                setTimeout(() => {
                    setIsClicked(false)
                }, 1000)
            }}>Button Animation</Button>
        </div>
    )
}

export default ButtonAnimation