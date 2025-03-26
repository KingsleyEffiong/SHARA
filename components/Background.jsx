'use client'
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

function FloatingShape({ position }) {
    const ref = useRef();
    const [rotation, setRotation] = useState([0, 0, 0]);

    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime();
            ref.current.position.x += Math.sin(t * 0.5 + position[0]) * 0.01;
            ref.current.position.y += Math.cos(t * 0.4 + position[1]) * 0.01;
            ref.current.position.z += Math.sin(t * 0.3 + position[2]) * 0.01;
            ref.current.rotation.x = rotation[0];
            ref.current.rotation.y = rotation[1];
            ref.current.rotation.z = rotation[2];
        }
    });

    // Handle click to rotate manually
    const handleClick = () => {
        setRotation([
            rotation[0] + Math.PI / 4,
            rotation[1] + Math.PI / 4,
            rotation[2] + Math.PI / 4
        ]);
    };

    return (
        <mesh ref={ref} position={position} scale={1.2} castShadow receiveShadow onClick={handleClick}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#0d2f2f"
                emissive="#0f3d3d"
                emissiveIntensity={0.9}
                metalness={0.6}
                roughness={0.4}
            />
        </mesh>
    );
}

function FloatingShapes() {
    return (
        <>
            {Array.from({ length: 50 }).map((_, i) => {
                const x = (Math.random() - 0.5) * 30;
                const y = (Math.random() - 0.5) * 25;
                const z = (Math.random() - 0.5) * 35;
                return <FloatingShape key={i} position={[x, y, z]} />;
            })}
        </>
    );
}

export default function Background() {
    return (
        <Canvas shadows camera={{ position: [0, 0, 20], fov: 75 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow />
            <Stars radius={150} depth={80} count={5000} factor={4} saturation={0} fade speed={1} />
            <FloatingShapes />
            <OrbitControls enableZoom enableRotate enablePan minDistance={10} maxDistance={30} />
        </Canvas>
    );
}
