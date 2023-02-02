<script lang="ts">
  import { onMount } from "svelte";

  import * as THREE from "three";

  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  import {Planet} from "../types";

  export let title: string = "Website Title.";

  let el: HTMLCanvasElement;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });




    const controls = new OrbitControls(camera, renderer.domElement);

    const sun = new Planet(50, 0xffc800, 0, 0);
    const mercury = new Planet(10, 0x696969, 200, 2.9);
    const venus = new Planet(14, 0xdb4d00, 400, 2.7);
    const earth = new Planet(15, 0x0384fc, 600, 3);


    scene.add(sun.mesh);
    scene.add(mercury.mesh);
    scene.add(venus.mesh);
    scene.add(earth.mesh);


    camera.position.z = 800;
    camera.position.x = 300;
    camera.position.y = 600;



    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      mercury.rotate(0.01);
      venus.rotate(0.01);
      earth.rotate(0.01);


      // camera.lookAt(mercury.mesh.position);

      renderer.render(scene,camera);
    };

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);
    resize();
    animate();
  });
</script>

<main>
  <canvas bind:this={el} />
</main>

<style>
</style>
