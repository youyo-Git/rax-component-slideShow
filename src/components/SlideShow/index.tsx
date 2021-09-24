import { createElement, useEffect, useRef, useState } from 'rax';
import View from 'rax-view';
import styles from './index.module.css';
import Image from 'rax-image';

interface slideShow {
  urlArr: String[];
}

function SlideShow(props: slideShow) {
  const { urlArr } = props;
  const wrapRef = useRef(null);
  const redDotRef = useRef(null);
  const slideNum: number = urlArr.length;
  let timerId = 0;
  let startX = 0;
  let endX = 0;
  let index = 2;

  // const [indexPage, setIndexPage] = useState(2)
  /* console.log('运行') */

  useEffect(() => {
    // 处理数组, 初始化长列表容器
    wrapRef.current.style.width = `${slideNum * 360}px`;
    // 红点
    redDotRef.current.style.transform = `translate(${0}px)`;
    // 自动播放 向右轮播
    timerId = go(2);
  }, []);

  /* 自动播放 */
  function go(indexPage: number): number {
    index = indexPage;
    console.log("时间id"+timerId)
    timerId = setInterval(() => {
      if (index === slideNum - 1) {
        removeRedDot(2);
      }
      wrapRef.current.style.transition = '1s linear';
      wrapRef.current.style.transform = `translate(${-360 * index}px)`;
      index++;
      if (index < slideNum) {
        // setIndexPage(index);
        removeRedDot(index);
      }
      // console.log(index)
      if (index > slideNum) {
        wrapRef.current.style.transition = 'none';
        wrapRef.current.style.transform = 'translate(-360px)';
        index = 2;
        // setIndexPage(index);
        removeRedDot(index);
      }
    }, 3000);
    return timerId;
  }

  /* 停止播放 */
  function stop(timerId: number): void {
    clearInterval(timerId);
    // console.log('清除的时间id' + timerId)
  }

  /* 手接触屏幕 */
  function handleTouchStart(e) {
    // 停止计时器
    stop(timerId);
    startX = e.touches[0].clientX;
    endX = startX;
    // console.log('startX'+startX)
  }

  /* 手在屏幕上移动 */
  function handleTouchMove(e) {
    endX = e.touches[0].clientX;
    // console.log('endX'+endX)
    const distance = Math.floor(startX - endX);
    wrapRef.current.style.transition = '0s linear';
    wrapRef.current.style.transform = `translate(${-distance + -360 * (index - 1)}px)`;
  }

  /* 手离开屏幕 */
  function handleTouchEnd(e) {
    // 打印当前是第几页
    // console.log('当前第几页:' + index)
    // 获取滑动范围
    const distance = Math.floor(startX - endX);
    // console.log('触摸距离:' + distance)
    if (distance > 0 && distance <= 50) {
      // 向左拖后往右边退
      wrapRef.current.style.transition = '0.5s linear';
      wrapRef.current.style.transform = `translate(${-360 * (index - 1)}px)`;
      // console.log('向左拖后往右边退')
    }
    if (distance > 0 && distance > 50) {
      // 翻到下一张
      wrapRef.current.style.transition = '0.5s linear';
      wrapRef.current.style.transform = `translate(${-360 * index }px)`;
      index++;
      // setIndexPage(index);
      removeRedDot(index);
      // console.log('翻到下一张')
      if (index === slideNum) {
        // 手动移动到slideNum+1,就定位到第;
        index = 2;
        removeRedDot(index);
        // setIndexPage(index);
        setTimeout(() => {
          wrapRef.current.style.transition = 'none';
          wrapRef.current.style.transform = `translate(${-360 * (index - 1)}px)`;
        }, 1000);
      }
    }

    if (distance < 0 && distance >= -50) {
      // 向右拖后往左边退
      wrapRef.current.style.transition = '0.5s linear';
      wrapRef.current.style.transform = `translate(${-360 * (index - 1)}px)`;
      // console.log('向右拖后往左边退')
    }
    if (distance < 0 && distance < -50) {
      // 翻到上一张
      wrapRef.current.style.transition = '0.5s linear';
      wrapRef.current.style.transform = `translate(${-360 * (index - 2)}px)`;
      index--;
      // setIndexPage(index);
      removeRedDot(index);
      // console.log('翻到上一张')
      if (index === 1) {
        // 手动移动到第一张,就定位到slideNum+1;
        index = slideNum - 1;
        removeRedDot(index);
        // setIndexPage(index);
        // console.log('tiaozhuan')
        setTimeout(() => {
          wrapRef.current.style.transition = 'none';
          wrapRef.current.style.transform = `translate(${-360 * (index - 1)}px)`;
        }, 1000);
      }
    }

    debounce(go(index), 5000);
  }

  /* 防抖 */
  function debounce(fn, time: number) {
    let timeout = null;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timerId = fn;
      }, time);
    };
  }

  /* 移动底部点 */
  function removeRedDot(index: number): void{
    redDotRef.current.style.transform = `translate(${(index - 2) * 15}px)`;
  }

  return (
    <View className={styles.viewBox}>
      <View
        className={`${styles.slideWrap}`}
        ref={wrapRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image className={styles.slideShow} x-for={(item, index) in urlArr} source={{ uri: `${process.env.PUBLIC_URL}${item}` }} key={index} />
      </View>

      <View className={styles.dotWrap} >
        <View className={styles.redDot} ref={redDotRef} />
        <View className={styles.dot} x-for={(item, indexPage) in slideNum - 2} key={indexPage} />
      </View>
    </View>
  );
}
export default SlideShow;
