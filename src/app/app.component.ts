import { Component, VERSION } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { FadeService } from './fade.service';

@Component({
  selector: 'my-app',
  providers: [FadeService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
      // :enter と :leave エイリアス
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('1500ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('1500ms', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
      // `:enter` と `:leave` は `void => *` と `* => void` の遷移!
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
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  constructor(private fade: FadeService) {}

  // @ViewChild('fileInput') FileInput!: ElementRef;
  fader(el: HTMLElement): void {
    this.fade.Out(el, 3000, () => {
      this.fade.In(el, 3000, () => {
        console.warn('fade Test.');
      });
    });
  }
}
