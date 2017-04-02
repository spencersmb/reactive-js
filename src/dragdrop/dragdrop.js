/* eslint-disable no-console */
import {BaseElement} from '../ui/base-element';
import $ from 'jquery';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

export class Dragdrop extends BaseElement{

  constructor() {
    super();
    this.box = '';
    this.mDown = '';
    this.mUp = '';
    this.mMove = '';
    this.mDrag = '';
  }

  init() {
    console.log('Drag and Drop');

    this.box = this.$element.find('#dd-main');
    this.mDown = Observable.fromEvent(this.box, 'mousedown');
    this.mUp = Observable.fromEvent(this.box, 'mouseup');
    this.mMove = Observable.fromEvent(document, 'mousemove');

    // 1) listen for click on box - mouseDown - figure out where cursor is in relation to the corner of the box
    // cursor offset from box
    // 2) Listen for mouseMove, based of off the original click point of cursor offset from original offset
    // 3) mouseUp: Let go of box!

        console.log(this.mDown);
    this.mDrag = this.mDown
      // Use mergeMap or ConcatMap here because we have 2 arrays deep here
    // Concat will wait for the inner observable to finish, where as mergeMap will just merge them as they come in
      .concatMap( evt => {
        // evt.clientX is distance from Left of window to the mouse.
        let offsetX = evt.clientX - this.box.offset().left;
        let offsetY = evt.clientY - this.box.offset().top;

        //map over the mouseMoves output and change it to reflect our position where we are holding the box
        return this.mMove
          .map( evt => ({
            left: evt.clientX - offsetX,
            top: evt.clientY - offsetY
          }))
          .takeUntil(this.mUp);
      })
      .subscribe(({top, left}) => {
        this.box.css({top: top, left: left});
      });


  }

  createElement(){
    super.createElement();
    this.init();
  }

  getElementString(){
    return `
        <div>
            <div id="dd-main">
            
            </div>
        </div>
        `;
  }

}