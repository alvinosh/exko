<script lang="ts">
  import { onMount } from "svelte";
  import { FRAG_SHADER } from "./fragShader";
  import { ShaderCanvas } from "./canvasShader";

  let canvas: HTMLCanvasElement;

  const STEP = 0.01;

  onMount(() => {
    const shaderCanvas = new ShaderCanvas(canvas);
    shaderCanvas.setShader(FRAG_SHADER);
    shaderCanvas.setUniform("iResolution", [
      canvas.width * window.devicePixelRatio,
      canvas.height * window.devicePixelRatio,
      0,
    ]);

    const animate = (time: number = 0) => {
      shaderCanvas.setUniform("iTime", time);
      shaderCanvas.render();
      requestAnimationFrame(() => animate(time + STEP));
    };

    requestAnimationFrame(animate);
  });
</script>

<canvas bind:this={canvas} id="canvas" />

<style>
  #canvas {
    z-index: 0;
    opacity: 0.1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
