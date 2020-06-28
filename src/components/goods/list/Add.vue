<template>
  <div>
    <navbar></navbar>
    <goods-detail :isEdit="false"></goods-detail>
  </div>
</template>

<script>
import GoodsDetail from './components/GoodsDetail'
import Navbar from './components/Navbar'
export default {
  name: 'addGoods',
  components: {
    GoodsDetail,
    Navbar
  }
}
</script>

<style lang="less" scoped>
</style>
