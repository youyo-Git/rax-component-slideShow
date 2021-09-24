import { createElement } from 'rax';
import View from 'rax-view';
import styles from './index.module.css';

import SlideShow from '@/components/SlideShow';

export default function Home() {
  const baseUrl = '/img/slideShow/';
  const urlArr: string[] = [];
  let urlItem = '';
  // 循环生成数组
  for (let i = 1; i < 6; i++) {
    urlItem = `${baseUrl}${i}.jpg`;
    urlArr.push(urlItem);
  }
  urlArr.unshift(urlArr[urlArr.length - 1]);
  urlArr.push(urlArr[1]);
  return (
    <View className={styles.homeContainer}>
      <SlideShow urlArr={urlArr} />
    </View>
  );
}
