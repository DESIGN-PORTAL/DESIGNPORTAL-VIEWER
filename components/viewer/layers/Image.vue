<template>
  <div class="dp-image" :style="style">
    <img :src="img" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    img: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    style() {
      return {
        borderRadius: `${this.data.borderRadius}%`,
        img: this.data.img,
        overflow: 'hidden',
      };
    },
  },
  methods: {
  },
};
</script>

<style lang="less">
.dp-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: block;
  }
}
</style>
