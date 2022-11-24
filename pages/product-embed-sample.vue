<template>
  <div class="page-wrap">
    <div class="content">
      <h1>3Dビューワー埋め込みサンプル</h1>
      <div class="double">
        <div class="embed-wrap">
          <iframe src="/product-model" frameborder="0"></iframe>
        </div>
        <div class="text">
          <p>
            こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。こちらはページ内に3Dモデルビューワーを埋め込んだ場合のサンプルです。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
.page-wrap {
  min-height: 100vh;
  background: linear-gradient(23deg, rgba(24,24,28,1) 0%, rgba(38,45,61,1) 55%, rgba(82,88,102,1) 100%);
}
.content {
  width: 1000px;
  margin: auto;
  padding: 100px 20px;
  color: #fff;
  @media screen and (max-width: 1100px) {
    width: 100%;
  }
}
h1 {
  font-size: 28px;
}
.double {
  display: flex;
  margin-top: 50px;
  @media screen and (max-width: 1100px) {
    display: block;
  }
}
.embed-wrap {
  height: 360px;
  width: 620px;
  margin-top: 30px;
  margin-right: 20px;
  @media screen and (max-width: 1100px) {
    width: 100%;
  }
}
iframe {
  width: 100%;
  height: 100%;
}
.text {
  margin-top: 30px;
  flex: 1;
}
</style>
