import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import { XR, createXRStore } from "@react-three/xr";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import CameraControls from "./components/CameraControls";
import LookControls from "./components/CameraControls";
import WasdControls from "./components/WasdControls.jsx";
import Board from "./components/Board.jsx";

//parts from: https://github.com/meta-quest/webxr-first-steps-react/blob/starting-template/tutorial/chapter1.md
const xrStore = createXRStore({
    emulate: {
        controller: {
            left: {
                position: [-0.15649, 1.43474, -0.38368],
                quaternion: [
                    0.14766305685043335, -0.02471366710960865, -0.0037767395842820406,
                    0.9887216687202454,
                ],
            },
            right: {
                position: [0.15649, 1.43474, -0.38368],
                quaternion: [
                    0.14766305685043335, 0.02471366710960865, -0.0037767395842820406,
                    0.9887216687202454,
                ],
            },
        },
    },
});

function App() {
    const cameraRef = useRef();

    return (
        <>
            <div onContextMenu={(e) => e.nativeEvent.preventDefault()}>
                <Canvas
                    style={{
                        position: "fixed",
                        width: "100vw",
                        height: "100vh",
                    }}
                >
                    <color args={[0x808080]} attach="background"/>
                    <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2.5, 2]} fov={75} />
                    <Environment preset="warehouse"/>
                    <mesh rotation-x={-Math.PI / 2}>
                        <planeGeometry args={[100, 100]}/>
                        <meshStandardMaterial color="green"/>
                    </mesh>
                    <XR store={xrStore}/>

                    <WasdControls />
                    <LookControls />

                    <Board />
                </Canvas>
            </div>
            <div
                style={{
                    position: "fixed",
                    display: "flex",
                    width: "100vw",
                    height: "100vh",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                    pointerEvents: "none",
                }}
            >
                <button
                    onClick={() => xrStore.enterVR()}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "20px",
                    }}
                >
                    Enter VR
                </button>
            </div>
        </>
    );
}

export default App;
