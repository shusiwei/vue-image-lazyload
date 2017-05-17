<template>
  <div>
    <ul>
      <li v-for="src of list">
        <img v-lazy="src" src="../assets/placeholder.png">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        'http://sgjs.4006996669.com/doc/example/carousel/1.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/2.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/3.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/4.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/5.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/6.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/7.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/8.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/9.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/10.jpg',
        'http://sgjs.4006996669.com/doc/example/carousel/11.jpg'
      ]
    };
  }
};
</script>

<style>
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
  padding: 10px;
}
img {
  display: block;
  margin: 0 auto;
  width: 640px;
  width: 426px;
}
</style>
