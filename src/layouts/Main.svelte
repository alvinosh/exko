<script lang="ts">
  import Canvas from "../components/Canvas.svelte";
  import Content from "../components/Content.svelte";

  import type { Content as C } from "../types";

  import data from "../content/planets.js";

  const content: C[] = JSON.parse(data) as C[];
</script>

<Canvas />

<main>
  {#each content as content}
    <Content title={content.title} id={content.title.toLowerCase()}>
      <h4 class="text-4xl font-extrabold text-white">{content.header}</h4>
      {#each content.text as text}
        <p class="text-xl leading-loose text-white">
          {text}
        </p>
      {/each}
    </Content>
  {/each}
</main>

<style>
</style>
