import {Canvas, useFrame} from "@react-three/fiber";
import {useRef, useState} from "react";
import {createXRStore, TeleportTarget, useXRInputSourceState, XR, XROrigin} from "@react-three/xr";
import {Environment, PerspectiveCamera} from "@react-three/drei";
import LookControls from "./components/controls/CameraControls.jsx";
import WasdControls from "./components/controls/WasdControls.jsx";
import Board from "./components/Board.jsx";
import {Floor} from "./components/models/floor.jsx";
import {Pillar} from "./components/models/pillar.jsx";
import {Stick} from "./components/models/stick.jsx";
import {Flag} from "./components/models/flag.jsx"
import {Dressing} from "./components/models/dressing.jsx";
import {Podium} from "./components/models/podium.jsx";
import {Group, Vector3} from "three";
import {LeftController} from "./components/controls/LeftController.jsx";
import {RightController} from "./components/controls/RightController.jsx";

//parts from: https://github.com/meta-quest/webxr-first-steps-react/blob/starting-template/tutorial/chapter1.md

function App() {
    const cameraRef = useRef();
    const LeftControlRef = useRef(null);
    const RightControlRef = useRef(null);
    const BoardRef = useRef(null);
    const [position, setPosition] = useState(new Vector3(0, 1.6, 14));

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
        controller: {
            teleportPointer: true,
            left: () => <LeftController ref={LeftControlRef} />,
            right: () => <RightController ref={RightControlRef} />,
        },
    });

    return (
        <>
            <div onContextMenu={(e) => e.nativeEvent.preventDefault()}>
                <Canvas
                    style={{position: "fixed", width: "100vw", height: "100vh",}}
                    shadows
                >
                    <color args={[0x808080]} attach="background"/>
                    <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 4, 14]} fov={75}/>
                    <ambientLight intensity={0.3}/>
                    <directionalLight
                        position={[-24, 17, -67]}
                        intensity={2}
                        castShadow={true}

                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-near={0.5}
                        shadow-camera-far={500}
                        shadow-bias={-0.002}
                        shadow-camera-top={300}
                        shadow-camera-bottom={-300}
                        shadow-camera-left={-300}
                        shadow-camera-right={300}
                    />
                    <XR store={xrStore}>
                        <XROrigin position={position}/>
                        <TeleportTarget onTeleport={setPosition}>
                            <Floor/>
                            <mesh position={[0, 1.1, 0]} visible={false}>
                            <boxGeometry args={[19,1,17]}/>
                                <meshBasicMaterial color="green"/>
                            </mesh>
                        </TeleportTarget>
                        <Podium/>
                    </XR>

                    <WasdControls/>
                    <LookControls/>

                    <Dressing/>
                    <Board leftControllerRef={LeftControlRef}
                           rightControllerRef={RightControlRef}
                           position={[0.7, 1.5, -0.5]}/>
                </Canvas>
            </div>
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                }}
            >
                <button
                    onClick={() => xrStore.enterVR()}
                    style={{
                        fontSize: "20px",
                        padding: "10px 20px",
                        cursor: "pointer",
                    }}
                >
                    Enter VR
                </button>
            </div>
        </>
    );
}

export default App;
