import {Flag} from "../models/flag.jsx";
import {useXRControllerButtonEvent, useXRInputSourceState} from "@react-three/xr";
import {forwardRef, useImperativeHandle, useRef} from "react";

export const LeftController = forwardRef((props, ref) => {
    const state = useXRInputSourceState("controller","left");
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
            <Flag scale={0.1} position={[0,-1,0]}/>
            <mesh ref={hitboxRef} visible={false} position={[0,-1,0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]}/>
                <meshBasicMaterial color="blue" wireframe/>
            </mesh>
        </group>
    );
});