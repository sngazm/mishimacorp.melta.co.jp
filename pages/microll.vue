<template>
  <div id="app">
    <div v-if="loadStarted">
      <p class="loading" v-if='loading'>
        <img src="@/assets/loading.png" alt="">
      </p>
      <VisualizerCanvas
        modelName="Product_Model2.glb"
        envName="photo_studio_01_62.hdr"
        :camX='firstView.posX' :camY='firstView.posY' :camZ='firstView.posZ'
        :targetX='firstView.targetX'
        :targetY='firstView.targetY'
        :targetZ='firstView.targetZ'
        :minDistance='5'
        :maxDistance="20"
        :toneMappingExposure="1"
        @loadEnd='loading = false'
        :useEnvBg='true'
        :useDirectionalLight="false"
        :directionalLightX="0.5"
        :directionalLightY="2"
        :directionalLightZ="5"
        ref='visualizer'
        :showGrid="false"
      >
        <template v-slot:annotations>
          <template v-for="(anno, index) in annotationData" >
            <Annotation :positionX="anno.x" :positionY="anno.y" :positionZ="anno.z" >
              <div class="symbol" @click="clickAnnotation(index)">
                {{ anno.symbol }}
              </div>
              <div class="popup-pc" v-show="selectedAnnotation == index">
                <div class="description" v-html="anno.descriptionHtml"></div>
                <button class="prev" @click="goPrev">◀︎</button>
                <button class="next" @click="goNext">▶︎</button>
                <button class="close" @click="close"></button>
              </div>
            </Annotation>
            <div class="popup-sp" v-show="selectedAnnotation == index">
              <div class="description" v-html="anno.descriptionHtml"></div>
              <button class="prev" @click="goPrev">◀︎</button>
              <button class="next" @click="goNext">▶︎</button>
              <button class="close" @click="close"></button>
            </div>
          </template>
        </template>
      </VisualizerCanvas>
    </div>

  </div>
</template>

<script lang="ts">
import { thisTypeAnnotation } from '@babel/types';
import Vue from 'vue';

// iOS Safariでのピンチインによる拡大縮小をストップ
document.addEventListener('touchstart', (e) => {
  if (e.touches.length >= 2) {
    e.preventDefault()
  }
}, {passive: false})

export default Vue.extend({
  data():any {
    return {
      loadStarted: true,
      loading: true,
      selectedAnnotation: null,
      firstView: {
        posX: 12.0,
        posY: 4.4,
        posZ: -6.2,
        targetX: 0,
        targetY: 3.0,
        targetZ: 0,
      },
      annotationData: [
        {
          x: 0.282116,
          y: 3.36857,
          z: 0.921109,
          symbol: 'A',
          descriptionHtml: "通し転造の場合、ここから製品を排出します。インフィード転造の場合、ワークストッパーの取付が可能です。（オプション）",
          view: {
            posX: -2.317663109463754,
            posY: 4.129535369089014,
            posZ: 8.162124594850079,
            targetX: 0.35940154430892984,
            targetY: 2.7133593317193316,
            targetZ: 0.7411577255990144,
          }
        },
        {
          x: -0.407817,
          y: 3.29113,
          z: 0.040002,
          symbol: 'B',
          descriptionHtml: "主軸はステッピングモーターを採用。ピッチ合わせは角度を数値で指定します。回転は最高120RPMまで調整可能です。高強度に同期させた回転機構です。",
          view: {
            posX: -4.348644193244604,
            posY: 2.780606760669226,
            posZ: -2.222155150379146,
            targetX: -0.34981265280152374,
            targetY: 3.182923967705239,
            targetZ: 0.7523174375060319,
          }
        },
        {
          x: -1.19659,
          y: 1.73479,
          z: 1.12461,
          symbol: 'C',
          descriptionHtml: "クーラントタンク	最大40L。ポンプで循環させています。",
          view: {
            posX: -0.21589992726017732,
            posY: 1.9499175728506812,
            posZ: 11.495758068229714,
            targetX: 0.007968690601788026,
            targetY: 1.753559023463489,
            targetZ: 0.5474325234129173,
          },
        },
        {
          x: 1.29351,
          y: 2.94239,
          z: 1.16489,
          symbol: 'D',
          descriptionHtml: "特許申請の独自ダイス機構を開発。通し転造時の主軸傾斜もブロック交換のみのカンタン操作。製品毎の段取替えも容易に行えるよう工夫しました。",
          view: {
            posX: 5.770064594298067,
            posY: 2.7664865552208364,
            posZ: 2.884058053762756,
            targetX: 0.10111045446086428,
            targetY: 2.9229988011579677,
            targetZ: -0.07314741368590273,
          }
        },
        {
          x: 0.364182,
          y: 4.18781,
          z: -0.458035,
          symbol: 'E',
          descriptionHtml: "主軸開閉の動力としてIAIエレシリンダーを採用。ポジションや速度を数値制御可能。最大押しつけ力0.9tまで。",
          view: {
            posX: 5.399467290569406,
            posY: 4.390892375538297,
            posZ: -3.6568363352420192,
            targetX: -0.05729499354758988,
            targetY: 3.806316210295033,
            targetZ: -1.0739166178532895,
          }
        },
        {
          x: 0.945198,
          y: 4.94729,
          z: 0.701507,
          symbol: 'F',
          descriptionHtml: "キーエンス製モニターを設置。主転RPM、回転方向、開閉時間の操作や製品毎の加工条件をメモ可能。消費電力をリアルタイム表示することでCNを常に意識。",
          view: {
            posX: 4.556937462818655,
            posY: 4.108590607174932,
            posZ: 3.00265084757538,
            targetX: 0.7521792676114865,
            targetY: 5.112110236512913,
            targetZ: -0.08227434269054486,
          }
        },
        {
          x: 0.945189,
          y: 6.07959,
          z: 1.35468,
          symbol: 'G',
          descriptionHtml: "キーエンス製シーケンサ採用。カウンター用の入力端子を用意。入力情報を基にモニター表示可能。",
          view: {
            posX: 4.369461018757635,
            posY: 7.2413755634474075,
            posZ: 2.3870085696208982,
            targetX: -0.7960479839294755,
            targetY: 5.061937073368785,
            targetZ: 0.02322608535392329,
          }
        },
        {
          x: -0.582657,
          y: 6.20408,
          z: 0.408294,
          symbol: 'H',
          descriptionHtml: "三相200V仕様。1kVA。エコな設備でSDGs、CNに貢献。",
          view: {
            posX: -5.811528616435516,
            posY: 2.922819419955222,
            posZ: 2.597070690101484,
            targetX: -0.334374296285839,
            targetY: 5.560839459788688,
            targetZ: 0.40704898345560714,
          }
        },
        {
          x: 1.34378,
          y: 0.290112,
          z: -0.642767,
          symbol: 'I',
          descriptionHtml: "キャスター付アジャスターボルト採用。設置場所を選びません。",
          view: {
            posX: 3.8522103049334797,
            posY: -1.7814218926861707,
            posZ: -2.5439839287112744,
            targetX: -0.51584338691275,
            targetY: 1.5548113333242037,
            targetZ: 0.85369455220629,
          }
        },
      ]

    }
  },
  computed: {
    bgUrl() {
      const url = require(`~/assets/bg/glasses.jpg`);
      console.log(url)
      return url
    }
  },
  methods: {
    refs(): any {
      return this.$refs
    },
    load() {
      this.loadStarted = true
      this.loading = true
    },
    updateColorMap(meshName: string, filePath: string) {
      this.selected = filePath
      this.refs().visualizer.updateColorMap(meshName, filePath)
    },
    moveCamera(num: number) {
      this.refs().visualizer.moveCamera(this.views[num])
    },
    clickAnnotation(index: number) {
      this.selectedAnnotation = index
      this.refs().visualizer.moveCamera(this.annotationData[index].view)
    },
    goNext() {
      this.clickAnnotation((this.annotationData.length + this.selectedAnnotation + 1) % this.annotationData.length)
    },
    goPrev() {
      this.clickAnnotation((this.annotationData.length + this.selectedAnnotation - 1) % this.annotationData.length)
    },
    close() {
      this.selectedAnnotation = null
      this.refs().visualizer.moveCamera(this.firstView)
    }

  }
});
</script>

<style lang="scss">
// ポップアップ部分をスマホなどでスワイプするとスクロールしてしまうの対策
canvas {
  // background-color: #333;
  // background: linear-gradient(18deg, rgba(116,199,219,1) 0%, rgba(19,12,92,1) 100%);
}

.header {
  position: relative;
  z-index: 1;
  .title {
    padding: 10px;
    color: #fff;
    font-family: "Helvetica Neue";
    font-weight: 200;
    font-size: 23px;
  }
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  font-size: 20px;
  z-index: 1;
  transform: translate(-50%, -50%);
}
.annotation {
  position: absolute;
  will-change: transform;
  transform: translate(0, 0);
  z-index: 1;
  transition: opacity ease-out .5s ;
  opacity: 0;
  color: #fff;
}
.symbol, .close {
  position: absolute;
  background-color: rgba(116, 12, 16,1);
  // max-width: 300px;
  // padding: 10px;
  line-height: 26px;
  height: 31px;
  width: 31px;
  text-align: center;
  border-radius: 15px;
  border: #fff 2px solid;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
  cursor: pointer;
}

.close {
  top: -15px;
  right: -15px;
  font-size: 20px;
  padding: 0;
  color: #fff;
  background-color: rgba(0,0,0,1);
  pointer-events: auto;
  &::before, &::after {
    content: '';
    position: absolute;
    top: 13px;
    left: 5px;
    display: block;
    width: 17px;
    height: 2px;
    border: 1px solid #fff;
    border-radius: 2px;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
}

.popup-pc, .popup-sp {
  z-index: 0;
  padding: 20px 20px 30px;
  min-width: 300px;
  background-color: rgba(0, 0, 0, 0.7);
  border: #fff 2px solid;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  pointer-events: none;
  color: #fff;
  @media screen and (max-width: 520px) {
    display: none;
  }
  .description  {
    font-size: 14px;
    line-height: 1.65;
  }

  .prev, .next {
    position: absolute;
    color: #fff;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
    pointer-events: auto;
  }
  .prev, .next {
    bottom: 10px;
    font-size: 14px;
  }
  .prev { right: 40px }
  .next { right: 20px }
  a {
    color: inherit
  }
  h3 {
    font-weight: bold;
    font-size: 20px;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
  }
}
.popup-pc {
  position: absolute;
  top: 15px;
  left: 15px;
}
.popup-sp {
  display: none;
  position: fixed;
  z-index: 1;
  bottom: 20px;
  left: 50%;
  width: calc(100vw - 40px);
  padding-bottom: 40px;
  transform: translateX(-50%);
  @media screen and (max-width: 520px) {
    display: block;
  }
  .prev, .next {
    font-size: 20px;
  }
  .prev {
    right: 50px;
  }
}
</style>
