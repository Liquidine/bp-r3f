import {useEffect} from 'react'
import {useThree} from "@react-three/fiber";
import {Euler} from 'three'

const euler = new Euler(0, 0, 0, 'YXZ')

//from: https://codesandbox.io/p/sandbox/r3f-wasd-controls-wft0n?file=%2Fsrc%2FLookControls.js%3A17%2C41
export default function LookControls() {
    const { camera } = useThree()
    useEffect(() => {
        const state = {
            drag: false,
            prev: { screenX: null, screenY: null },
        }
        const onMouseDown = (e) => {
            state.drag = true
            e.target.style.cursor = 'grabbing'
            //e.target.setPointerCapture(e.pointerId)
            state.prev.screenX = e.screenX
            state.prev.screenY = e.screenY
        }
        const onMouseUp = (e) => {
            state.drag = false
            e.target.style.cursor = 'grab'
        }
        const onMouseMove = (e) => {
            if (state.drag) {
                const dx = e.screenX - state.prev.screenX
                const dy = e.screenY - state.prev.screenY
                euler.setFromQuaternion(camera.quaternion)
                euler.y -= dx * 0.002
                euler.x -= dy * 0.002
                camera.quaternion.setFromEuler(euler)
            }
            state.prev.screenX = e.screenX
            state.prev.screenY = e.screenY
        }
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mouseup', onMouseUp)
    }, [camera])
    return null
}