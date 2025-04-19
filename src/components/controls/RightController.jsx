import {Stick} from "../models/stick.jsx";
import {useXRControllerButtonEvent, useXRInputSourceState} from "@react-three/xr";
import {forwardRef, useImperativeHandle, useRef} from "react";

export const RightController = forwardRef((props, ref) => {
    const state = useXRInputSourceState("controller","right");
    const hitboxRef = useRef();
    const triggerPressed= useRef(false);


    useImperativeHandle(ref, () => ({
        getHitbox: () => hitboxRef.current,
        isTriggerPressed: () => triggerPressed.current,
    }));

    useXRControllerButtonEvent(state, "xr-standard-trigger", (state) => {
        triggerPressed.current = state === "pressed";
    });

    return (
        <group>
            <Stick scale={0.1} position={[0,-0.3,0]}/>
            <mesh ref={hitboxRef} visible={true} position={[0.05,1.1,0]}>
                <boxGeometry args={[0.2, 0.2, 0.2]}/>
                <meshBasicMaterial color="red" wireframe/>
            </mesh>
        </group>
    );
});