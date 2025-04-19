// VRController.jsx
//implementation from:https://qiita.com/f-kaito/items/a68ea9fd1e5b378f178e#%E6%9C%80%E5%BE%8C%E3%81%AB
import { useFrame } from '@react-three/fiber'
import { useXRControllerLocomotion, useXRInputSourceState, XROrigin } from '@react-three/xr'
import * as THREE from 'three'

export function VRController({ playerJump, playerMove }) {
    const controllerRight = useXRInputSourceState('controller', 'right')

    const physicsMove = (velocity, rotationYVelocity) => {
        playerMove({
            forward: false,
            backward: false,
            left: false,
            right: false,
            rotationYVelocity,
            newVelocity: velocity,
        })
    }

    useXRControllerLocomotion(physicsMove, { speed: 5 })

    useFrame(() => {
        if (controllerRight?.gamepad?.['a-button']?.state === 'pressed') {
            playerJump?.()
        }
    })

    return <XROrigin position={[0, -1.25, 0]} />
}