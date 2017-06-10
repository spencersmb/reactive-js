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
    this.dragdropv1();

    this.dragdropv2();


  }

  dragdropv2(){

    const $drag = this.$element.find('#drag');
    const $document = $(document);
    const $dropAreas = this.$element.find('.drop-area');
    const $dragable= this.$element.find('.dragable');
    console.log($document);

    const beginDrag$ = Observable.fromEvent($drag, "mousedown");
    const endDrag$ = Observable.fromEvent($document, "mouseup");
    const mouseMove$ = Observable.fromEvent($document, "mousemove");

    const currentOverArea$ = Observable.merge(
      Observable.fromEvent($dropAreas, "mouseleave")
        .map(e => {
          console.log("outside",e);
          return null;
        }),
      Observable.fromEvent($dropAreas, "mouseenter")
        .map(e => {

          console.log("inside target");
          return $(e.target);
        }),
      Observable.fromEvent($document, "mousemove")
        .map(e => {

          console.log("inside doc");
          return $(e.target);
        })
    );


    //Hook into the mouseDown event
    const drops$ = beginDrag$
      //Create a sideffect that helps with not selecting Text + add our class to the box
      .do( e => {
        e.preventDefault();
        $drag.addClass('dragging');
      })
      //mergeMap here because we will have 2 arrays from our original mousedown event + mouseMove we are returning. We essentially have our listener for mousedown - when thats fired we immediately push a 2nd stream in of mousemoves and dont stop listening until mouseup event.
      .mergeMap(startEvent => {
        return mouseMove$
          .takeUntil(endDrag$)
          .do(moveEvent => moveDrag(startEvent, moveEvent)) // Sideeffect of css for mouse placement on El
          .last() //Don't push anything to the subscriber until all the events above complete - essentially dont emit a value until we end the stream with takeUntil.
          .withLatestFrom(currentOverArea$, (b, $area) =>{
            console.log($area);
            return $area;
          });
      })
      .do(()=>{
        // then remove the class so we can grab the box again
        $drag.removeClass('dragging')
          .animate({top:0, left: 0}, 250);
      });

    drops$.subscribe($dropArea=>{
      // console.log('no drop area, removing class dropped');
      $dropAreas.removeClass('dropped');
      if ($dropArea.hasClass('drop-area')) {
        // console.log(console.log(`drop area is: `,$dropArea));
        $dropArea.addClass('dropped');
      }
    });

    function moveDrag( startEvent, moveEvent){
      $drag.css({
        left: moveEvent.clientX - startEvent.clientX,
        top: moveEvent.clientY - startEvent.clientY
      });
    }


  }

  dragdropv1(){
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
            <div id="ddv2">
                <div id="drag" class="dragable"></div>
                <ul>
                  <li class="drop-area">Drop Area 1</li>
                  <li class="drop-area">Drop Area 2</li>
                  <li class="drop-area">Drop Area 3</li>
                  <li class="drop-area">Drop Area 4</li>
                  <li class="drop-area">Drop Area 5</li>
                  <li class="drop-area">Drop Area 6</li>
                </ul>
            </div>
        </div>
        `;
  }

}