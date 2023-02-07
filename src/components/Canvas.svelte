<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { Planet } from "../types";
  import ToolTip from "../components/ToolTip.svelte";

  export let title: string = "Website Title.";

  let x = 0,
    y = 0;
  let name = "none";
  let visible = false;
  let activePlanet: number | null = null;

  let el: HTMLCanvasElement;
  onMount(() => {
    let mouse = new THREE.Vector2(0, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    const raycaster = new THREE.Raycaster(); // create once

    const geometry = new THREE.PlaneGeometry(5000, 5000);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, opacity: 0, alphaTest: 1 });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(Math.PI / 2);
    scene.add(plane);

    camera.position.x = 600;
    camera.position.y = 2000;
    camera.position.z = -1600;

    camera.lookAt(new THREE.Vector3(-500, 0, -500));

    const planets = [
      new Planet("sun", 50, 0xffc800, 0, 0),
      new Planet("mercury", 10, 0x696969, 300, 2.9),
      new Planet("venus", 14, 0xdb4d00, 600, 2.7),
      new Planet("earth", 15, 0x0384fc, 900, 2.5),
      new Planet("mars", 8, 0xf59542, 1200, 2.2),
      new Planet("jupiter", 28, 0xe6a165, 1500, 0.4),
      new Planet("saturn", 24, 0xdba372, 1800, 0.2),
      new Planet("uranus", 18, 0x80acff, 2100, 0.1),
      new Planet("neptune", 17, 0x2066e8, 2400, 0.08),
    ];

    planets.forEach((planet) => {
      planet.add(scene);
    });

    let start = Date.now();

    const animate = () => {
      requestAnimationFrame(animate);
      let delta = (Date.now() - start) / 1000;
      update(delta);
      render();
      start = Date.now();
    };

    const update = (delta: number) => {
      planets.forEach((planet) => {
        planet.rotate(delta);
      });

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([plane], true);
      intersects.forEach((intersect) => {
        let index = Math.round(intersect.point.length() / 300);

        planets.forEach((x) => {
          x.unhighlight();
        });

        if (index < planets.length) {
          name = planets[index]!.name;
          visible = true;
          activePlanet = index;
          planets[index]!.highlight();
        }
      });
      if (intersects.length == 0) {
        activePlanet = null;
        visible = false;
      }
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", (event) => {
      x = event.clientX;
      y = event.clientY;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("mousedown", () => {
      if (activePlanet) {
        document.location.href = `#${planets[activePlanet]!.name}`;
      }
    });

    window.addEventListener("resize", resize);
    resize();
    animate();
  });
</script>

<canvas bind:this={el} />
<ToolTip {x} {y} {visible} {name} />

<style>
  canvas {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
