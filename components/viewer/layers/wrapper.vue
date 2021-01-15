<template>
  <div
    class="dp-object-wrapper"
    :style="wrapperStyle"
  >
    <div :style="style">
      <component :is="preName + item.type" v-bind.sync="item" :data.sync="item" :scale="scale" />
    </div>
  </div>
</template>

<script>
import { components, preName } from "./index";

export default {
  components: {
    ...components,
  },
  inject: ["designView"],
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      preName,
      startX: 0,
      startY: 0,
      pointStart: {
        x: 0,
        y: 0,
      },
      originPosition: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      onDrag: false, // 是否在拖拽中
      onResize: false, // 是否在改变大小
      resizeType: "", // 大小改变方向类型
    };
  },
  computed: {
    renderWidth() {
      return this.item.width * this.designView.scale;
    },
    renderHeight() {
      return this.item.height * this.designView.scale;
    },
    renderLeft() {
      return this.item.left * this.designView.scale;
    },
    renderTop() {
      return this.item.top * this.designView.scale;
    },
    wrapperStyle() {
      const { item } = this;
      return {
        width: `${this.renderWidth}px`,
        height: `${this.renderHeight}px`,
        left: `${this.renderLeft}px`,
        top: `${this.renderTop}px`,
        transform: `rotate(${item.rotate}deg)`,
        zIndex: this.index,
        opacity: `${item.hide ? 0 : 1}`,
      };
    },
    style() {
      const { item } = this;
      const { scale } = this.designView;
      const style = {
        lineHeight: `${item.lineHeight}`,
        opacity: item.opacity / 100,
      };
      return style;
    },
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.dp-object-wrapper {
  position: absolute;
  box-sizing: border-box;
  user-select: none;
  // cursor: move;

  > div {
    width: 100%;
    height: 100%;
  }
}
</style>
