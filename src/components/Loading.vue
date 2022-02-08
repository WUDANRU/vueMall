<template>
  <div class="loading">
    <img src="/imgs/loading-svg/loading-bars.svg" alt=""> <!-- /imgs/和index.html  public是根目录，所以它的子级写成/+  svg是矢量图 -->
  </div>
</template>
<script>
  export default{
    name:'loading'
  }
</script>
<style lang="scss">
  .loading{
    height:80px;
    line-height:80px;
    text-align:center;
    padding:30px 0;
    img{ //这里的img样式不生效是因为没有指定lang="scss"
      height:100%;
    }
  }
</style>