import {Canvas} from "@react-three/fiber";
import {useRef} from "react";
import {createXRStore, XR} from "@react-three/xr";
import {KeyboardControls} from "@react-three/drei";
import MineSweeper from "./components/mineSweeper.jsx";
import {Floor} from "./components/models/floor.jsx";
import {Dressing} from "./components/models/dressing.jsx";
import {Podium} from "./components/models/podium.jsx";
import {LeftController} from "./components/controls/LeftController.jsx";
import {RightController} from "./components/controls/RightController.jsx";
import {PlayerControls} from "./components/controls/PlayerControls.jsx";
import {CuboidCollider, Physics, RigidBody} from "@react-three/rapier";

//parts from: https://github.com/meta-quest/webxr-first-steps-react/blob/starting-template/tutorial/chapter1.md

function App() {
    const LeftControlRef = useRef(null);
    const RightControlRef = useRef(null);

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
            left: () => <LeftController ref={LeftControlRef}/>,
            right: () => <RightController ref={RightControlRef}/>,
        },
    });

    return (
        <>
            <div onContextMenu={(e) => e.nativeEvent.preventDefault()}>
                <KeyboardControls
                    map={[
                        {name: 'forward', keys: ['ArrowUp', 'KeyW']},
                        {name: 'backward', keys: ['ArrowDown', 'KeyS']},
                        {name: 'left', keys: ['ArrowLeft', 'KeyA']},
                        {name: 'right', keys: ['ArrowRight', 'KeyD']},
                        {name: 'jump', keys: ['Space']},
                    ]}
                >
                    <Canvas
                        style={{position: "fixed", width: "100vw", height: "100vh",}}
                        shadows
                        onCreated={({camera}) => {
                            window.cameraRef = camera
                        }}
                    >
                        <color args={[0x808080]} attach="background"/>
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
                            <Physics gravity={[0, -9.81, 0]}>
                                <Floor/>
                                <RigidBody type="fixed" colliders="cuboid">
                                    <CuboidCollider args={[9.5, 0.5, 8.5]} position={[0, 1.1, 0]} />
                                </RigidBody>
                                <PlayerControls/>
                            </Physics>
                            <Podium/>
                        </XR>

                        <Dressing/>
                        <MineSweeper
                                offline={true}
                                mineCount={11}
                                position={[0.7, 1.5, -0.5]}
                                leftControllerRef={LeftControlRef}
                                rightControllerRef={RightControlRef}/>
                    </Canvas>
                </KeyboardControls>
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
