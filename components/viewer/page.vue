<template>
  <div class="viewer-page">
    <component :is="preName + 'Background'" v-if="page.bg.url" :bg="page.bg"></component>

    <template v-for="(layer, index) in page.layers">
      <Layer :key="index" :item="layer" :index="index" />
    </template>
  </div>
</template>

<script>
import { components, preName } from "./layers";
import Layer from "./layers/wrapper";
export default {
  components: {
    ...components,
    Layer,
  },
  props: {
    page: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      preName,
    };
  },
};
</script>

<style lang="less">
</style>
