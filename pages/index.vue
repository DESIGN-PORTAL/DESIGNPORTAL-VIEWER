<template>
  <div v-if="notPhone" class="not-phone">请在移动端查看~~</div>
  <div
    v-else
    class="viewer-wrapper"
    @mousedown="handleMousedown"
    @mousemove="handleMousemove"
    @mouseup="handleMouseup"
    @mouseleave="handleMouseup"
    @mouseout="handleMouseup"
    @touchstart="handleMousedown"
    @touchmove="handleMousemove"
    @touchend="handleMouseup"
  >
    <div v-if="notFound">
      未找到此作品
    </div>

    <div class="viewer" v-if="jsonData">
      <div
        class="page-wrapper"
        v-for="(page, index) in jsonData.pages"
        :key="page.id"
        :style="pageStyle(index)"
      >
        <Page :page="page" :scale="scale" />
      </div>



      <audio v-if="jsonData.music && jsonData.music.url" autoplay loop ref="music">
        <source :src="jsonData.music.url" type="audio/mpeg" />
      </audio>

      <div v-if="jsonData.music && jsonData.music.url" class="icon-music" :class="!musicPlaying && 'icon-music-closed'" @click="play()"></div>
    </div>
  </div>
</template>

<script>
import Page from "@/components/viewer/page";

// 设计尺寸 宽度
const designWidth = 375;

const defaultTitle = '未命名作品';

export default {
  components: {
    Page
  },
  async asyncData({ query, $axios }) {
    const result = await $axios.$get(`project/getOne?id=${query.id}`);
    if (!result) {
      return {
        notFound: true
      };
    }
    // console.log('jsonData, ', result.data)

    return {
      jsonData: result.data,
      notFound: false,
      socialShare: result.socialShare,
    };
  },
  provide() {
    return {
      designView: this
    };
  },
  data() {
    return {
      notPhone: false, // 是否在移动设备打开
      scale: 1,
      jsonData: {},
      notFound: false, // 未找到作品
      currentPageIndex: 0, // 当前页下标
      renderWidth: 375,
      renderHeight: 603,
      onDrag: false,
      direction: null, // 拖动方向 一旦向上（下左右）拖动 就不能改变方向 down, up, left, right
      // 拖动起始坐标
      startPoint: {
        x: 0,
        y: 0
      },
      // 移动距离
      move: {
        x: 0, // x轴移动距离
        y: 0 // y轴移动距离
      },
      willDisplayPageIndex: 0, // 即将显示的页面的下标
      willDisplayPageDistance: 0, // 即将显示页面动画距离
      animationTime: 200, // 动画完成时间 毫秒
      musicPlaying: true,
      socialShare: {},
    };
  },
  head() {
    return {
      title: this.socialShare.title || defaultTitle,
      meta: [
        {
          property: 'og:image',
          content: this.socialShare.image,
        },
        {
          property: 'og:description',
          content: this.socialShare.remark || 'DESIGN PORTAL',
        },
        {
          name: 'description',
          content: this.socialShare.remark || 'DESIGN PORTAL',
        },
      ],
    };
  },
  mounted() {
    this.renderHeight = window.innerHeight;
    this.renderWidth = window.innerWidth;

    // 宽度大于960提示用移动端浏览
    if (this.renderWidth > 960) {
      this.notPhone = true;
    }

    // 求缩放比例
    this.scale = this.renderWidth / designWidth;

    window.addEventListener("message", this.handleMessage);
    this.sendMessage({
      type: "jsonData",
      data: JSON.stringify(this.jsonData)
    });
    this.useFont();
    this.setSocialShare();
  },
  methods: {
    /**
     * 点击播放
     */
    play() {
      if (this.$refs.music.paused) {
        this.musicPlaying = true;
        this.$refs.music.play();
      } else {
        this.musicPlaying = false;
        this.$refs.music.pause();
      }
    },
    /**
     * 当修改字体,添加新的style标签
     */
    useFont() {
      let content = "";

      this.jsonData.fontList.forEach(element => {
        content += `@font-face {
          font-family: '${element.fontFamily}';
          src: url('${element.fontUrl}');
        }`;
      });

      let style = document.createElement("style");
      let body = document.querySelector("head");
      body.append(style);

      style.innerHTML = content;
    },
    /**
     * 设置微信分享标题 图片等
     */
    setSocialShare() {
      const title = document.createElement('h1');
      title.style.display = 'none';
      title.text = this.socialShare.title || defaultTitle;

      const image = document.createElement('img');
      image.style.width = '100px';
      image.style.height = '100px';
      image.style.zIndex = -1;
      image.setAttribute('alt', this.socialShare.title || defaultTitle);

      image.src = this.socialShare.image;

      document.body.insertBefore(image, document.body.firstElementChild)
      document.body.insertBefore(title, document.body.firstElementChild)
    },
    handleMousedown(e) {
      if (this.onAnimate || !this.jsonData) return;

      this.onDrag = true;
      if (e.type === "touchstart") {
        this.startPoint = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        };
      } else {
        this.startPoint = {
          x: e.pageX,
          y: e.pageY
        };
      }
    },
    handleMousemove(e) {
      if (!this.onDrag) return;

      const { x, y } = this.startPoint;

      let newX = 0,
        newY = 0;

      if (e.type === "touchmove") {
        newX = e.touches[0].pageX;
        newY = e.touches[0].pageY;
      } else {
        newX = e.pageX;
        newY = e.pageY;
      }

      const moveX = newX - x;
      const moveY = newY - y;
      this.move = {
        x: moveX,
        y: moveY
      };

      // 如果没有方向
      if (!this.direction) {
        // 设置即将显示的页面下标
        if (moveY > 0) {
          // if (this.currentPageIndex <= 0) return;
          this.direction = "down";
          this.willDisplayPageIndex = this.currentPageIndex - 1;
        } else {
          if (this.currentPageIndex >= this.jsonData.pages.length - 1) return;
          this.direction = "up";
          this.willDisplayPageIndex = this.currentPageIndex + 1;
        }

        this.willDisplayPageDistance = this.renderHeight;
      } else {
        // 即将显示的页面的移动距离
        this.willDisplayPageDistance =
          this.renderHeight + (this.direction === "up" ? moveY : -moveY);
      }
    },
    handleMouseup(e) {
      if (!this.onDrag || this.onAnimate) return;

      this.onDrag = false;
      this.doAnimation();
    },
    /**
     * 页面切换动画
     */
    doAnimation() {
      return new Promise(resovle => {
        if (
          this.willDisplayPageIndex < 0 ||
          this.willDisplayPageIndex >= this.jsonData.pages.length
        ) {
          resovle();
          return;
        }
        this.onAnimate = true;
        const span = (this.willDisplayPageDistance / this.animationTime) * 10;

        const interval = setInterval(() => {
          if (this.willDisplayPageDistance <= 0) {
            clearInterval(interval);
            this.onAnimate = false;
            this.direction = null;
            this.currentPageIndex = this.willDisplayPageIndex;
            this.willDisplayPageIndex = -1;
            this.willDisplayPageDistance = 0;
            resovle();
            return;
          }
          this.willDisplayPageDistance -= span;
        }, 10);
      });
    },
    /**
     * 页面样式
     */
    pageStyle(index) {
      const {
        willDisplayPageDistance,
        willDisplayPageIndex,
        currentPageIndex,
        direction
      } = this;

      const willDisplay = willDisplayPageIndex === index;

      const isShow = currentPageIndex === index || willDisplay;

      let value = 0;
      if (willDisplay) {
        value =
          direction === "up"
            ? willDisplayPageDistance
            : -willDisplayPageDistance;
      }

      return {
        transform: `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`,
        display: `${isShow ? "block" : "none"}`,
        zIndex: willDisplay ? 1099 : index
      };
    },
    /**
     * 移动到某一页
     */
    moveTo(index) {
      console.log("moveTo", index);
      this.willDisplayPageIndex = index;
      this.direction = index > this.currentPageIndex ? "up" : "down";

      if (index !== this.currentPageIndex) {
        this.willDisplayPageDistance = this.renderHeight;
        this.doAnimation().then(res => {
          this.sendMessage({
            type: "onPageChange",
            data: this.currentPageIndex
          });
        });
      }
    },
    /**
     * 接收到消息处理
     */
    handleMessage(message) {
      const { type, data } = message.data;
      const typeMap = {
        changePage: () => {
          this.moveTo(data);
        }
      };
      console.log("message", message);

      typeMap[type] && typeMap[type]();
    },
    /**
     * 发送消息
     */
    sendMessage(data) {
      window.parent && window.parent.postMessage(data, "*");
    }
  }
};
</script>

<style lang="less">
.not-phone {
  padding: 40px;
  text-align: center;
}
.viewer-wrapper {
  width: 100vw;
  height: 100vh;
  .viewer {
    width: 100vw;
    height: 100vh;
    touch-action: pan-x;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    .page-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: #fff;
      box-shadow: 0 0 10px 0 #ddd;
    }
  }

  .icon-music {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    width: 30px;
    height: 30px;
    background-image: url(~assets/img/music-playing.png);
    background-size: 100% 100%;
    animation: 5s linear 0s infinite normal forwards running musicPlaying;
    opacity: 0.7;
  }

  .icon-music-closed {
    background-image: url(~assets/img/music-paused.png);
    animation-play-state: paused !important;
  }
}

@keyframes musicPlaying {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
