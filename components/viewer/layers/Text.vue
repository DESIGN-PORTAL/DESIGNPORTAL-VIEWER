<template>
  <div
    :style="style"
    ref="text"
    class="dp-text"
    v-html="data.content || '<div />'"
  >
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    style() {
      return {
        fontFamily: `${this.data.fontFamily}`,
        fontSize: `${this.data.fontSize * this.scale}px`,
        textAlign: this.data.textAlign,
        color: this.data.color,
        letterSpacing: `${this.data.letterSpacing * this.scale}px`,
        fontWeight: this.data.fontWeight,
        fontStyle: this.data.fontStyle,
        textDecoration: this.data.textDecoration,
        fontImg: this.data.fontImage,
      };
    },
  },
  methods: {
    /**
     * 鼠标点击事件
     */
    handleMouseDown(e) {
    },
  },
};
</script>

<style lang="less">
.dp-text {
  word-break: break-word;
  outline: none;
}
</style>