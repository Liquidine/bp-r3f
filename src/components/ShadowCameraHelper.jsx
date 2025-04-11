import { CameraHelper } from 'three';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function ShadowCameraHelper({ lightRef }) {
    const { scene } = useThree();

    useEffect(() => {
        if (lightRef.current) {
            const helper = new CameraHelper(lightRef.current.shadow.camera);
            scene.add(helper);
            return () => scene.remove(helper);
        }
    }, [lightRef, scene]);

    return null;
}
