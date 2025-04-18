import {Stick} from "../models/stick.jsx";
import {useXRControllerButtonEvent, useXRInputSourceStateContext} from "@react-three/xr";
import {forwardRef, useImperativeHandle, useRef} from "react";

export const RightController = forwardRef((props, ref) => {
    const state = useXRInputSourceStateContext("controller");
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
            <Stick scale={0.02}/>
            <mesh ref={hitboxRef} visible={true} position={[0,0.26,0]}>
                <boxGeometry args={[0.05, 0.05, 0.05]}/>
                <meshBasicMaterial color="red" wireframe/>
            </mesh>
        </group>
    );
});