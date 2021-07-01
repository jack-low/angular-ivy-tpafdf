import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FadeService {
  constructor() {}
  // fadeOut & fadeIn
  // 参考URL: => https://baku.hateblo.jp/entry/2015/01/14/175601
  Out(eln: HTMLElement, ms: number, fn: Function) {
    const el: HTMLElement = <HTMLElement>eln;
    ms = ms || 400;
    el.style.opacity = '1';
    let interval: number = 50;
    const step: number = interval / ms;
    const tick = () => {
      el.style.opacity = String(step - Number(el.style.opacity));
      if (Number(+el.style.opacity) > 0) {
        setTimeout(tick, interval);
      } else {
        el.style.display = 'none';
        if (typeof fn === 'function') {
          fn();
        }
      }
    };
    tick();
  }
  In(eln: HTMLElement, ms: number, fn: Function) {
    const el: HTMLElement = <HTMLElement>eln;
    if (+el.style.opacity < 1) {
      ms = ms || 400; // duration in milliseconds
      el.style.opacity = '0';
      el.style.display = 'block';
      let interval: number = 50;
      const step: number = interval / ms;
      const tick = () => {
        el.style.opacity = String(Number(el.style.opacity) + step);
        if (Number(+el.style.opacity) < 1) {
          setTimeout(tick, interval);
        } else {
          if (typeof fn === 'function') {
            fn();
          }
        }
      };
      tick();
    } else {
      el.style.display = 'block'; // fallback IE8
      if (typeof fn === 'function') {
        fn();
      }
    }
  }
}
