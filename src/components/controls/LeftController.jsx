import {Flag} from "../models/flag.jsx";
import {useXRControllerButtonEvent, useXRInputSourceStateContext} from "@react-three/xr";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";

export const LeftController = forwardRef((props, ref) => {
    const state = useXRInputSourceStateContext("controller");
    const hitboxRef = useRef();
    const triggerPressed = useRef(false);

    useImperativeHandle(ref, () => ({
        getHitbox: () => hitboxRef.current,
        isTriggerPressed: () => triggerPressed.current,
    }));

    useXRControllerButtonEvent(state, "xr-standard-trigger", (state) => {
        triggerPressed.current = state === "pressed";
    });

    return (
        <group>
            <Flag scale={0.02}/>
            <mesh ref={hitboxRef} visible={true} position={[0,0,0]}>
                <boxGeometry args={[0.05, 0.05, 0.05]}/>
                <meshBasicMaterial color="blue" wireframe/>
            </mesh>
        </group>
    );
});