<template>
  <div class="canvas-wrap">
    <canvas ref="canvas"></canvas>
    <div id="annotations" ref='annotations'>
      <slot name="annotations" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AnnotationVue from '../Annotation.vue'
import Visualizer from './Visualizer'
let visualizer: Visualizer

export default Vue.extend({
  props: {
    modelName: String,
    camX: Number,
    camY: Number,
    camZ: Number,
    offsetX: Number,
    offsetY: Number,
    offsetZ: Number,
    spOffsetX: Number,
    spOffsetY: Number,
    spOffsetZ: Number,
    followMouse: {
      type: Boolean,
      default: false
    },
    targetX: Number,
    targetY: Number,
    targetZ: Number,
    rotationX: Number,
    rotationY: Number,
    rotationZ: Number,
    positionX: Number,
    positionY: Number,
    positionZ: Number,
    useDirectionalLight: {
      type: Boolean,
      default: false
    },
    directionalLightX: Number,
    directionalLightY: Number,
    directionalLightZ: Number,
    scale: Number,
    minDistance: Number,
    maxDistance: Number,
    animated: {
      type: Boolean,
      default: false
    },
    envName: String,
    envBgName: String,
    useEnvBg: {
      type: Boolean,
      default: true
    },
    toneMappingExposure: Number,
    showGrid: {
      type: Boolean,
      default: false
    },
    autoRotate: {
      type: Boolean,
      default: false
    },
    disableScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  mounted () {
    // canvas要素を渡す。
    visualizer = new Visualizer({
      canvas: this.$refs.canvas,
      modelName: this.modelName,
      camX: this.camX,
      camY: this.camY,
      camZ: this.camZ,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      offsetZ: this.offsetZ,
      spOffsetX: this.spOffsetX,
      spOffsetY: this.spOffsetY,
      spOffsetZ: this.spOffsetZ,
      followMouse: this.followMouse,
      targetX: this.targetX,
      targetY: this.targetY,
      targetZ: this.targetZ,
      positionX: this.positionX,
      positionY: this.positionY,
      positionZ: this.positionZ,
      rotationX: this.rotationX,
      rotationY: this.rotationY,
      rotationZ: this.rotationZ,
      useDirectionalLight: this.useDirectionalLight,
      directionalLightX: this.directionalLightX,
      directionalLightY: this.directionalLightY,
      directionalLightZ: this.directionalLightZ,
      scale: this.scale,
      minDistance: this.minDistance,
      maxDistance: this.maxDistance,
      animated: this.animated,
      envName: this.envName,
      envBgName: this.envBgName,
      useEnvBg: this.useEnvBg,
      toneMappingExposure: this.toneMappingExposure,
      showGrid: this.showGrid,
      autoRotate: this.autoRotate,
      disableScroll: this.disableScroll
    });

    const loading = setInterval(() => {
      const loadFinished = visualizer.loadFinished
      console.log('loadFinished:', loadFinished)
      if (loadFinished) {
        clearInterval(loading)
        this.$emit('loadEnd')
      }
    }, 500)
  },
  updated() {
    this.$children.forEach((el) => {
      if (el.$options.name === "Annotation") {
        interface AnnotationComponent extends Vue {
          positionX: number,
          positionY: number,
          positionZ: number
        }
        const annotation = el as AnnotationComponent

        visualizer.addAnnotation({
          el: annotation.$el as HTMLElement,
          x: annotation.positionX,
          y: annotation.positionY,
          z: annotation.positionZ
        })
      }
    })
  },
  computed: {
  },
  watch: {
  },
  methods: {
    updateColorMap(meshName: string, filePath: string) {
      visualizer.updateColorMap(meshName, filePath)
    },
    updateMeshMaterial(meshName: string, materialName: string) {
      visualizer.updateMeshMaterial(meshName, materialName)
    },
    updateMaterialColor(materialName: string, color: {r: number, g: number, b: number}) {
      visualizer.updateMaterialColor(materialName, color)
    },
    moveCamera(view: any) {
      visualizer.setNextView(view)
    },
    /**
     * Get the URL parameter value
     *
     * @param  name {string} パラメータのキー文字列
     * @return  url {url} 対象のURL文字列（任意）
     */
    getParam(name: string, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  }
})
</script>

<style scoped>
canvas, .canvas-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
</style>
