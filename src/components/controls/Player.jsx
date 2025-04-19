// Player.jsx
//implementation from:https://qiita.com/f-kaito/items/a68ea9fd1e5b378f178e#%E6%9C%80%E5%BE%8C%E3%81%AB
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
    CapsuleCollider,
    interactionGroups,
    RigidBody,
    useRapier
} from '@react-three/rapier'
import { IfInSessionMode } from '@react-three/xr'
import { useRef, useState } from 'react'
import { VRController } from './VRControls.jsx'
import * as THREE from 'three'

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

const vector3Obj = new THREE.Vector3()
const quaternionFunc = new THREE.Quaternion()
const quaternionFunc2 = new THREE.Quaternion()
const eulerAngles = new THREE.Euler()

export function Player() {
    // Reference to the player's RigidBody
    const rigidBodyRef = useRef(null)
    // Get physics engine and world
    const { rapier, world } = useRapier()
    // Get keyboard controls (e.g., forward, backward, left, right, jump)
    const [, get] = useKeyboardControls()
    // Flag to check if the player can jump
    const [canJump, setCanJump] = useState(true)

    // Player movement function
    const playerMove = ({
                            forward,
                            backward,
                            left,
                            right,
                            rotationYVelocity,
                            velocity,
                            newVelocity,
                        }) => {
        if (rigidBodyRef.current == null) return

        // Use current velocity if not provided
        if (!velocity) {
            velocity = rigidBodyRef.current.linvel()
        }

        // Apply rotation
        const { x, y, z, w } = rigidBodyRef.current.rotation()
        quaternionFunc.set(x, y, z, w)
        quaternionFunc.multiply(
            quaternionFunc2.setFromEuler(eulerAngles.set(0, rotationYVelocity, 0, 'YXZ'))
        )
        rigidBodyRef.current.setRotation(quaternionFunc, true)

        // Apply velocity directly in VR mode
        if (newVelocity) {
            rigidBodyRef.current.setLinvel(
                { x: newVelocity.x, y: velocity?.y ?? 0, z: newVelocity.z },
                true
            )
            return
        }

        // Calculate direction from keyboard input
        frontVector.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0))
        sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0)
        direction
            .subVectors(frontVector, sideVector)
            .applyQuaternion(quaternionFunc) // Apply current player rotation
            .setComponent(1, 0)
            .normalize()
            .multiplyScalar(SPEED)

        rigidBodyRef.current.setLinvel(
            { x: direction.x, y: velocity?.y ?? 0, z: direction.z },
            true
        )
    }

    // Player jump function
    const playerJump = () => {
        if (!rigidBodyRef.current) return
        const position = rigidBodyRef.current.translation()

        // Cast ray downward to detect if grounded
        const ray = new rapier.Ray(position, { x: 0, y: -1, z: 0 })
        const hit = world.castRay(ray, 1.1, true)
        const grounded = hit !== null || position.y <= 1

        if (grounded) {
            setCanJump(true)
            if (canJump) {
                const velocity = rigidBodyRef.current.linvel()
                rigidBodyRef.current.setLinvel(
                    { x: velocity.x, y: 7.5, z: velocity.z },
                    true
                )
                setCanJump(false)
            }
        }
    }

    // Per-frame update
    useFrame((state) => {
        if (rigidBodyRef.current == null) return

        const { forward, backward, left, right, jump } = get()
        const velocity = rigidBodyRef.current.linvel()
        vector3Obj.set(velocity.x, velocity.y, velocity.z)

        // Move the camera with the player
        const { x, y, z } = rigidBodyRef.current.translation()
        state.camera.position.set(x, y, z)

        if (rigidBodyRef.current) {
            playerMove({
                forward,
                backward,
                left,
                right,
                rotationYVelocity: 0,
                velocity,
            })

            if (jump) {
                playerJump()
            }
        }
    })

    return (
        <>
            <RigidBody
                ref={rigidBodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 10, 0]}
                enabledRotations={[false, false, false]} // Lock rotation to prevent tipping over
                collisionGroups={interactionGroups([0], [0])}
            >
                {/* Define player hitbox with capsule collider */}
                <CapsuleCollider args={[1, 0.7]} />

                {/* Enable VR mode controls only during a VR session */}
                <IfInSessionMode allow={['immersive-vr']}>
                    <VRController playerJump={playerJump} playerMove={playerMove} />
                </IfInSessionMode>
            </RigidBody>
        </>
    )
}
