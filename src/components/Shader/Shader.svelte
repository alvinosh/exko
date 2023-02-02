<script lang="ts">
  import { onMount } from "svelte";
  import { ShaderCanvas } from "./canvasShader";

  import FRAG_SHADER from "./testshader.js";

  let canvas: HTMLCanvasElement;

  const STEP = 0.01;

  onMount(() => {
    const shaderCanvas = new ShaderCanvas(canvas);
    shaderCanvas.setShader(FRAG_SHADER);
    const animate = (time: number = 0) => {
      if (canvas) {
        const WIDTH = Math.floor(canvas.getBoundingClientRect().width);
        const HEIGHT = Math.floor(canvas.getBoundingClientRect().height);
        shaderCanvas.setUniform("iResolution", [WIDTH, HEIGHT, 0]);
        shaderCanvas.setUniform("iTime", time);
        shaderCanvas.render();
      }
      requestAnimationFrame(() => animate(time + STEP));
    };

    requestAnimationFrame(animate);
  });
</script>

<canvas bind:this={canvas} id="canvas" />

<style>
  #canvas {
    z-index: 0;
    opacity: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
