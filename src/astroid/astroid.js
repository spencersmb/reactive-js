/* eslint-disable no-console */
import {BaseElement} from '../ui/base-element';
import $ from 'jquery';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

export class Astroid extends BaseElement{

  constructor() {
    super();
    this.rocksEl = '';
    this.blasterEl = '';
    this.hitsEl = '';
    this.missesEl = '';
    this.shotsEl = '';
    this.state = {
      rocks: [],
      shots: [],
      blasterPos: 447,
      hits: 0,
      misses: 0
    };

    this.letter_P = 80; //keycode
    this.right_arrow = 39;
    this.left_arrow = 37;
    this.spacebar = 32;
    this.arrows = [this.right_arrow, this.left_arrow];

    this.arrowDowns = '';
    this.arrowUps = '';
    this.spaceUps = '';
    this.directions = '';
    this.blasterPos = '';

    this.gameInterval = 20;
    this.paused = false;
    this.pauser = new BehaviorSubject(this.paused);
    this.gameTimer = Observable.interval(this.gameInterval);

    // example of converting the cold obs to a hot below
    // this.gameTimer = Observable.interval(this.gameInterval).share();

    //depending on if we send a true or false statement to this it will pause or continue time interval
    //when true we tell the observable to stop emitting data without unsubscribing from it by using .never();
    // assign switchMap to the Subject Observer that returns the most recent observable -> so if the timer is true we pass it the .never() observable, if false we pass the gameTimer interval observable and the timer will start up again.
    // ex: this.pauser.next(true);
    this.pausableTimer = this.pauser.switchMap( paused => paused ? Observable.never() : this.gameTimer );

    this.keydowns = Observable.fromEvent(document, 'keydown');
    this.keyups = Observable.fromEvent(document, 'keyup');

  }

  init() {
    console.log('Astroid Game');

    this.rocksEl = this.$element.find('#rocks');
    this.blasterEl = this.$element.find('#blaster');
    this.hitsEl = this.$element.find('#hits');
    this.missesEl = this.$element.find('#misses');
    this.shotsEl = this.$element.find('#shots');

    //Pause Behaviour
    //filter out keycode letter P
    //when this happens pause the timer by toggling it
    this.keydowns
      .filter(evt => evt.keyCode === this.letter_P)
      .subscribe(()=>this.pauser.next(this.paused = !this.paused)); //toggle

    //Blaster
    this.arrowDowns = this.keydowns
      .filter(this.isArrow.bind(this))
      .map(evt => {
        if(evt.keyCode === this.right_arrow){
          return 1;
        }else if(evt.keyCode === this.left_arrow){
          return -1;
        }else{
          return 0;
        }
      });

    this.arrowUps = this.keyups.filter(this.isArrow.bind(this)).mapTo(0); //mapTO a hardcoded value everytime

    //Blaster shooting
    this.spaceUps = this.keyups.filter(this.isSpaceBar.bind(this)); //determine if the spacebar is up with a bool

    // Observable.of(1, 2, 3).mergeMapTo(Observable.of(10)).subscribe(console.log);
    //---10--10--100--//

    // when you press the bar - start the sequence and ignore everything between the initial keypress and the last keypress - only
    // know when the bar is being held down but don't out put space,space,space,space, just know that space is being held down
    // so that when space is held down we can output a fire event at every interval.
    this.shooting = this.keydowns
      .filter(this.isSpaceBar.bind(this))
      .throttle( () => this.spaceUps ) //1 event output even if the button is held down until they release so this begins our sequnce which we start below
      .mergeMapTo( //merge everything into the parent Observable from inner Observable

        //use concact to say whenever the spacebar is not down - always output false
        Observable.concat(

          // output true false on a specific time interval that will alternate with the game interval and if they are divisible
          // by 2 to turn them into booleans
          this.toggleInterval(0, this.gameInterval, this.gameInterval * 5)
          .map( i => i % 2 === 0)
          .takeUntil(this.spaceUps),

          Observable.of(false)

        )

      )
      .startWith(false);
    
    //start with 0 so we know it shouldnt move, but when we hold and press an arrow, move until we key up.
    this.directions = Observable.merge(this.arrowDowns, this.arrowUps)
      .distinctUntilChanged()
      .startWith(0);

    //THIS IS NOW IN THE UPDATE STATE
    // this now emits a time value and the latest output from directions observable sent to blasterPos
    // so we use scan to take both observables and return the current position + the direction * 5 , which will make it move faster
    // this.blasterPos = this.pausableTimer
    //   .withLatestFrom(this.directions)
    //   .scan((pos, [time, dir]) => {
    //     // Return a number between 0 and 895
    //     return Math.max(0, Math.min(pos + (dir * 5), 895) );
    //   }, 447);

    this.how = this.pausableTimer
      .withLatestFrom(this.directions)
      .withLatestFrom(this.shooting, (a,b) => {
        return a.concat([b]);
      })
      .scan((acc, curr) => this.updateState(Object.assign(this.state, acc, curr), {}));

    // this.how.subscribe(console.log);


    this.pausableTimer
      .withLatestFrom(this.directions)
      .withLatestFrom(this.shooting, (a,b) => {
        return a.concat([b]);
      })
      .scan((acc, curr) => {
        return this.updateState( acc, curr);
      }, this.state)
      .subscribe(v=>{
        return this.updateView(v);
      });
  }

  isArrow(evt){
    return this.arrows.indexOf(evt.keyCode) > -1;
  }

  isSpaceBar(evt){
    return evt.keyCode === this.spacebar;
  }

  rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  toggleInterval( initial = 0, period1 = 0, period2 = 0 ){
    return Observable.create( sub => {
      let count = 0;

      function fn1() {
        sub.next(count++);
        setTimeout(fn2, period1);
      }

      function fn2(  )
      {
        sub.next(count++);
        setTimeout(fn1, period2);
      }

      setTimeout(fn1, initial);
    });
  }

  createRock(){
    return {
      top: 0,
      left: this.rand(0, 870)
    }
  }



  //this recieves extra data from blasterPosition
  updateState(state, [time, dir, shooting]){
    let {rocks, misses, shots} = state;

    //add Rocks
    // for evvery 50 frames add a rock
    if(time % 50 === 0 ){
      rocks.push(this.createRock());
    }

    //add shots
    if(shooting){
      shots.push({top: 370, left: state.blasterPos})
    }

    //Move Rocks
    // rocks.forEach(rock => rock.top += 1);
    rocks
      .map(rock => rock.top += 1);

    // Move Shots
    shots.forEach(shot => shot.top -= 1);

    //Remove rocks outside of window
    let rocksLen = rocks.length;
    rocks = rocks.filter(rock => rock.top < 370);
    misses += rocksLen - rocks.length;

    //remove past shots
    shots = shots.filter(shot => shot.top > 0);


    //return new state overridding rocks and misses
    return Object.assign({}, state, {
      rocks,
      shots,
      misses,
      blasterPos: Math.max(0, Math.min(state.blasterPos + (dir * 5), 895) )
    });
  }

  updateView(state){
    //create HTML for rocks
    let rockHTML = state.rocks
      .map(rock => `<div class="rock" style="top: ${rock.top}px; left: ${rock.left}px;"></div>`).join('');

    let shotsHTML = state.shots
      .map(shots => `<div class="shots" style="top: ${shots.top}px; left: ${shots.left}px;"></div>`).join('');

    //update Rocks
    this.rocksEl.html(rockHTML);

    //update Misses
    this.missesEl.html(state.misses);

    //update Blaster
    this.blasterEl.css({left: state.blasterPos});

    //update shots
    this.shotsEl.html(shotsHTML);
  }

  createElement(){
    super.createElement();
    this.init();
  }

  getElementString(){
    return `
      <div>
        <div id="astroid-app">
        
          <div id="rocks"></div>
          <div id="shots"></div>
          <div id="blaster"></div>
          <div id="points">
            <p><span id="hits"> 0 </span> hits </p>
            <p><span id="misses"> 0 </span> misses </p>
          </div>
        
        </div>
      </div>
      `;
  }

}