<script lang="ts">
  import Shader from "../components/Shader.svelte";

  export let title: string = "Website Title.";
</script>

<main>
  <Shader />
  <div id="background" class="w-screen bg-slate-900">
    <div class="container mx-auto pl-5">
      <h1 class="text-[18rem] font-sans font-black text-slate-100">{title}</h1>
      <h3 class="text-5xl ml-5 font-sans font-black text-slate-100">Build With Us</h3>
    </div>
  </div>
</main>

<style>
  #background {
    z-index: -100;
    height: 100vh;
  }
</style>
