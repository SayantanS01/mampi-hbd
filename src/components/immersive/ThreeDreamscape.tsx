"use client";

import { useEffect, useRef } from "react";
import type { Object3D } from "three";
import type { BirthdayTheme } from "./theme-data";

type ThreeModule = typeof import("three");

type DisposableObject = Object3D & {
  geometry?: { dispose: () => void };
  material?: { dispose: () => void } | Array<{ dispose: () => void }>;
};

const dreamPalettes: Record<
  BirthdayTheme,
  {
    particle: string;
    heart: string;
    accent: string;
    emissive: string;
    fog: string;
  }
> = {
  pastel: {
    particle: "#ffd1e8",
    heart: "#ff6fae",
    accent: "#b68cff",
    emissive: "#ff9ed0",
    fog: "#fff2fb",
  },
  luxury: {
    particle: "#f5c96a",
    heart: "#d8a73c",
    accent: "#fff2b2",
    emissive: "#b78327",
    fog: "#050505",
  },
  cartoon: {
    particle: "#8ee7ff",
    heart: "#ff6ba8",
    accent: "#ffe56f",
    emissive: "#ff8fca",
    fog: "#fff3cc",
  },
  galaxy: {
    particle: "#a5c8ff",
    heart: "#ff6fd8",
    accent: "#80ffea",
    emissive: "#8d7cff",
    fog: "#0b0b2f",
  },
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createHeartShape(THREE: ThreeModule) {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;

  shape.moveTo(x, y + 0.28);
  shape.bezierCurveTo(x - 0.5, y + 0.82, x - 1.15, y + 0.38, x - 0.92, y - 0.24);
  shape.bezierCurveTo(x - 0.72, y - 0.78, x - 0.08, y - 1.04, x, y - 1.22);
  shape.bezierCurveTo(x + 0.08, y - 1.04, x + 0.72, y - 0.78, x + 0.92, y - 0.24);
  shape.bezierCurveTo(x + 1.15, y + 0.38, x + 0.5, y + 0.82, x, y + 0.28);

  return shape;
}

function disposeObject(THREE: ThreeModule, object: Object3D) {
  object.traverse((child) => {
    const disposable = child as DisposableObject;

    disposable.geometry?.dispose();

    if (Array.isArray(disposable.material)) {
      disposable.material.forEach((material) => material.dispose());
    } else {
      disposable.material?.dispose();
    }
  });

  THREE.Cache.clear();
}

export function ThreeDreamscape({ theme }: { theme: BirthdayTheme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let cleanup: (() => void) | undefined;
    let disposed = false;

    if (!canvas) {
      return undefined;
    }

    void import("three").then((THREE) => {
      if (disposed || !canvasRef.current) {
        return;
      }

      const palette = dreamPalettes[theme];
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: "high-performance",
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(palette.fog, theme === "galaxy" ? 0.035 : 0.022);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
      camera.position.set(0, 0, 8.5);

      const group = new THREE.Group();
      scene.add(group);

      const particleCount = theme === "galaxy" ? 1500 : theme === "cartoon" ? 900 : 1100;
      const positions = new Float32Array(particleCount * 3);

      for (let index = 0; index < particleCount; index += 1) {
        const stride = index * 3;
        positions[stride] = randomBetween(-12, 12);
        positions[stride + 1] = randomBetween(-8, 8);
        positions[stride + 2] = randomBetween(-10, 5);
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        blending: THREE.AdditiveBlending,
        color: palette.particle,
        depthWrite: false,
        opacity: theme === "luxury" ? 0.72 : 0.9,
        size: theme === "galaxy" ? 0.032 : 0.045,
        transparent: true,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particles);

      const heartGeometry = new THREE.ExtrudeGeometry(createHeartShape(THREE), {
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.025,
        bevelThickness: 0.025,
        depth: 0.09,
        steps: 1,
      });
      heartGeometry.center();

      const bubbleGeometry = new THREE.SphereGeometry(0.12, 24, 24);
      const floaterCount = theme === "cartoon" ? 26 : 18;
      const floaters: Array<{ object: Object3D; speed: number; phase: number; drift: number }> = [];

      for (let index = 0; index < floaterCount; index += 1) {
        const useBubble = theme === "cartoon" && index % 3 === 0;
        const material = new THREE.MeshStandardMaterial({
          color: index % 2 === 0 ? palette.heart : palette.accent,
          emissive: palette.emissive,
          emissiveIntensity: theme === "galaxy" ? 0.45 : 0.2,
          metalness: theme === "luxury" ? 0.48 : 0.08,
          roughness: theme === "luxury" ? 0.22 : 0.45,
        });
        const mesh = new THREE.Mesh(useBubble ? bubbleGeometry : heartGeometry, material);
        const scale = useBubble ? randomBetween(1.25, 2.2) : randomBetween(0.09, 0.2);

        mesh.scale.setScalar(scale);
        mesh.position.set(randomBetween(-6.5, 6.5), randomBetween(-4.5, 4.5), randomBetween(-4.5, 2));
        mesh.rotation.set(randomBetween(-1, 1), randomBetween(-1, 1), randomBetween(-1, 1));
        group.add(mesh);
        floaters.push({
          object: mesh,
          speed: randomBetween(0.18, 0.42),
          phase: randomBetween(0, Math.PI * 2),
          drift: randomBetween(0.16, 0.55),
        });
      }

      const ambientLight = new THREE.AmbientLight(0xffffff, theme === "luxury" ? 0.7 : 0.95);
      const keyLight = new THREE.PointLight(palette.accent, theme === "galaxy" ? 3 : 2.2, 18);
      const rimLight = new THREE.PointLight(palette.heart, 1.6, 14);
      keyLight.position.set(4, 3, 5);
      rimLight.position.set(-4, -2, 3);
      scene.add(ambientLight, keyLight, rimLight);

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const clock = new THREE.Clock();
      let animationFrame = 0;

      const animate = () => {
        const elapsed = clock.getElapsedTime();
        particles.rotation.y = elapsed * (theme === "galaxy" ? 0.015 : 0.008);
        particles.rotation.x = Math.sin(elapsed * 0.12) * 0.04;
        group.rotation.z = Math.sin(elapsed * 0.08) * 0.025;

        floaters.forEach((floater, index) => {
          floater.object.position.y += Math.sin(elapsed * floater.speed + floater.phase) * 0.0025;
          floater.object.position.x += Math.cos(elapsed * floater.speed + floater.phase) * floater.drift * 0.0018;
          floater.object.rotation.x += 0.003 + index * 0.00008;
          floater.object.rotation.y += 0.004;
        });

        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };

      window.addEventListener("resize", resize);
      resize();
      animate();

      cleanup = () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        disposeObject(THREE, scene);
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [theme]);

  return <canvas aria-hidden="true" className="dreamscape-canvas" ref={canvasRef} />;
}
