/**
 * @name vue-lazyload-directive for vue2
 *
 * 为vue添加图片懒加载
 * 支持所iOS7+、安卓4.4+、Chrome、Firefox、IE10+、Edge
 *
 * @example
 * <img v-lazy="imgSrc" :src="placeholderSrc">
 */

import Vue from 'vue';
// 添加 IntersectionObserver polyfill
import 'intersection-observer';

/**
 * viewport 探测器
 *
 * @params {Function} 探测过执行的回调
 * @options {Object} 其它参数
 *
 * @url https://wicg.github.io/IntersectionObserver/
 * @url https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill
 * @url http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
 * @url https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 * @url https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
 */
const observer = new window.IntersectionObserver(entries => {
  for (let entrie of entries) {
    console.log(entrie.intersectionRatio, entrie.target.getBoundingClientRect());
    if (entrie.intersectionRatio > 0.25) {
      emit(entrie.target).then(({el, cache}) => cache ? apply(el, true) : transition(el).then(el => apply(el, true))).catch(el => apply(el, false));
    };
  };
}, {
  root: window.document.body,
  threshold: [0, 0.25, 0.5, 0.75, 1]
});

// 动画事件名称
const transitionend = 'transition' in window.document.body.style ? 'transitionend' : 'webkitTransitionEnd';

/**
 * @name 图片元素绑定占位图
 *
 * @params {Img Element} el * 要绑定占位图的图片元素
 */
const bind = (el) => {
  el.placeholder = el.src;
};

/**
 * @name 将图片添加到数组队列
 *
 * @params {Img Element} el * 要加入到队列的图片元素
 * @params {String} src * 真实的图片源地址
 */
const push = (el, src) => {
  // 标记真实的图片源地址
  el.lazy = src;

  // 标记图片状态为挂起
  el.setAttribute('lazy', 'pending');

  observer.observe(el);
};

/**
 * @name 从数组队列中移除
 *
 * @params {Img Element} el * 要从队列中移除的图片元素
 */
const remove = (el) => observer.unobserve(el);

/**
 * @name 更新图片元素状态
 *
 * @params {Img Element} el * 将要更新的图片元素
 * @params {String} src * 新的图片源地址
 */
const update = (el, src) => {
  if (el.lazy !== src) {
    switch (el.getAttribute('lazy')) {
      case 'pending' :
      case 'loading' :
        el.lazy = src;
        break;

      case 'success' :
      case 'failed' :
        push(el, src);
        break;
    };
  };
};

/**
 * @name 图片元素触发可见
 *
 * @params {Img Element} el * 将要触发显示的图片元素
 *
 * @retrun {Promise} 返回的图片加载Promise
 */
const emit = (el) => {
  // 标记图片状态为加载中
  el.setAttribute('lazy', 'loading');

  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = el.lazy;

    // 如果源图片存在于缓存
    if (image.complete) {
      resolve({el, cache: true});
    } else {
      image.addEventListener('load', () => resolve({el, cache: false}));
      image.addEventListener('error', () => reject(el));
    };
  });

  return promise;
};

/**
 * @name 应用真实的图片源地址，并将此图片元素从队列中移除
 *
 * @params {Img Element} el * 显示的图片元素
 * @params {Boolean} ok * 图上片源地址的请求是否成功
 */
const apply = (el, ok) => {
  el.src = ok ? el.lazy : el.placeholder;
  el.setAttribute('lazy', ok ? 'success' : 'failed');

  remove(el);
};

/**
 * @name 图片请求完成后执行的过渡动画
 *
 * @params {Img Element} el * 执行过渡的图片元素
 * @params {Number [0, 1]} opacity * 透明过渡的值
 *
 * @retrun {Promise} 返回过渡的Promise
 */
const transition = el => {
  // 保存原先的transition值
  const styleNode = el.style;
  const original = styleNode.transition || styleNode.webkitTransition;
  const promise = new Promise((resolve) => {
    // 图片淡出，引用正常的图片地址
    const fadeOut = (evt) => {
      styleNode.opacity = 1;

      // 移除事件绑定
      el.removeEventListener(transitionend, fadeOut);
      el.addEventListener(transitionend, fadeIn);

      resolve(el);
    };
    // 图片淡入，还原原有的状态
    const fadeIn = () => {
      styleNode.transition = styleNode.webkitTransition = original;
      styleNode.removeProperty('opacity');

      // 移除事件绑定
      el.removeEventListener(transitionend, fadeIn);
    };

    // 图片开始淡出
    styleNode.transition = styleNode.webkitTransition = 'opacity .3s ease';
    styleNode.opacity = 0;

    // 增加 transitionend 事件
    el.addEventListener(transitionend, fadeOut);
  });

  return promise;
};

// 添加vue指令
Vue.directive('lazy', {
  bind: (el) => bind(el),
  inserted: (el, binding) => push(el, binding.value),
  update: (el, binding) => update(el, binding.value),
  unbind: (el) => remove(el)
});
