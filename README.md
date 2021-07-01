# angular-ivy-tpafdf

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/angular-ivy-tpafdf)

Angularでアニメーションをやってみたいと思い、定番のフェードアウト&フェードインをやってみた。

## Angular Test-Codes No.1 [fadeIn&Out]

### [アニメーションの遷移とトリガー][Ang-tat]
File `app.component.ts` に、以下を追加し、`:enter` と `:leave` エイリアスで記述するといい。 
`void => *` と `* => void` で紹介しているところが多いが、　　
これだと遷移直後などの場合、該当のHTML要素をターゲットにすることは難しくので、　
Viewに挿入、削除されるHTML要素をターゲットにするには、エイリアス `:enter` と `:leave` を使用するのが望ましい。

```typescript
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'my-app',
  ...,
  animations: [
    trigger('flyInOut', [
      // 
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('1500ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('1500ms', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
      // state('in', style({ opacity: 0, transform: 'translateX(0)' })),
      // transition('void => *', [
      //   style({ opacity: 0, transform: 'translateX(-100%)' }),
      //   animate(500)
      // ]),
      // transition('* => void', [
      //   animate(500, style({ opacity: 1, transform: 'translateX(100%)' }))
      // ])
    ])
  ]
})
```

### 自作版で実行してみる。
Service File,`fade.service.ts`を追加します。
使用したコンポーネントにて、`import { FadeService } from './fade.service';`で呼び出し、
該当のElementを引数にマイクロ秒単位で、functionを追加して、利用できるようになります。
以下、使い方。
*参考にしたサイト: [JavaScriptで fadeIn(),fadeOut() をつくってみた][link01]*

- File-Name: `fade.service.ts`

```typescript
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
```

- File-Name: `app.component.ts`

```typescript
import { FadeService } from './fade.service';

@Component({
  selector: 'my-app',
  ...,
  providers: [FadeService],
})

export class AppComponent {
  constructor(private fade: FadeService) {}
  fader(el: HTMLElement): void {
    this.fade.Out(el, 3000, () => {
      this.fade.In(el, 3000, () => {
        console.warn('fade Test.');
      });
    });
  }
}
```

- File-Name: `app.component.html`

```html
...
<p (click)="fader(fadeIn)" #fadeIn>click Me!!</p>
...
```

<!-- Links. -->
[Ang-tat]:https://angular.jp/guide/transition-and-triggers
[link01]:https://baku.hateblo.jp/entry/2015/01/14/175601