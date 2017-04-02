/* eslint-disable no-console */
import { createSubscriber } from '../utils/utils';
import { BaseElement } from '../ui/base-element';
import Rx from 'rxjs/Rx';

/*
 Once a page is created using the NEW keyword, Create element is called which creates the HTML for this page
 So after super.createElement(); adds html to the page, we create NEW content that we want to add to the page.

 Any interactivity for content on this page must be created in the element itself and not via this page.

 */
export class Obsv_1 extends BaseElement {

  constructor() {
    super();
  }

  partOne() {

    //BASIC OBSERVABLE
    //this will not start until we subscribe to it.
    this.simple$ = new Rx.Observable(observer => {
      setTimeout(() => {
        observer.next("Value 1");

        setTimeout(() => {
          observer.next("Another Value");
          observer.complete();
        }, 1000);

      }, 1000);
    });

    //ERROR OBSERVABLE EXAMPLE
    this.error$ = new Rx.Observable(observer => {
      observer.error(new Error('Sorry this is an error!'));
    });

    this.simple$.subscribe(
      v => console.log(`Value: ${v}`), // this first maps to the next function
      e => console.log(`Error: ${e}`),
      () => console.log("Complete")
    );

    //Second Subscription with the same original Observable
    setTimeout(()=> {
      this.error$.subscribe(
        v => console.log(`Second subscription Value: ${v}`), // this first maps to the next function
        e => console.log(`Second subscription Error: ${e.stack}`),
        () => console.log("Second subscription Complete")
      );
    }, 3000);
  }

  partTwo() {

    const everySecond = this.createInterval$(1000);

    const subscription = everySecond.subscribe(createSubscriber("one"));

    setTimeout(() => {
      subscription.unsubscribe();
    }, 3000);

  }

  builtIns() {

    /*
     interval
     */

    // Rx.Observable.interval(500) //do something every .5 ms for 5 times
    //   .take(5)
    //   .subscribe(createSubscriber("Interval"));

    /*
     Of - takes in multiple items and pass them individually
     */

    // Rx.Observable.of("hello world")
    //   .subscribe(createSubscriber("of"));

    /*
     From - takes an iterable thing like an array or a generator / observable
     */

    // Rx.Observable.from([23, 10, 4])
    //   //zip - a is the value / b is the index in this case
    //   //zip combines the two observables
    //   .zip(Rx.Observable.interval(500), ( a, b) => a)
    //   .subscribe(createSubscriber("From"));


    /*
     Defer - takes an iterable thing like an array or a generator / observable
     */
    let sideffect = 0;
    const defer$ = Rx.Observable.defer(() => {
      sideffect++;
      return Rx.Observable.of(sideffect);
    });

    defer$.subscribe(createSubscriber("defer$.one"));
    defer$.subscribe(createSubscriber("defer$.two"));
    defer$.subscribe(createSubscriber("defer$.three"));

  }

  hotcold_pt1() {

    /*
     When we add publish it listens to the observable even if we are not subscribed,
     so when we do subscribe to it, it may have already passed several values.
     */
    const interval = Rx.Observable.interval(1000)
      .take(10)
      .publish(); // convert a cold obvs to a hot observable

    interval.connect();

    setTimeout(()=> {
      interval.subscribe(createSubscriber("one"));
    }, 1200);

    //we get the 10 items again - but only from the begining
    setTimeout(()=> {
      interval.subscribe(createSubscriber("two"));
    }, 3000);

  }

  hotcold_pt2() {

    //fake socket.io
    const socket = {
      on: () => {
      }
    };

    const chatMessages$ =
      new Rx.Observable(observer => {
        console.log("subscribed to chat");
        socket.on("chat: message", message => observer.next(message));
      })
        .publish();

    chatMessages$.connect();

    //we create two subscribers here and if chatMessages$ was a cold subscriber - it would create two subscriptions
    //but since its converted to a hot subscriber - everyone subscribes to the same obvs and it only creates one.
    chatMessages$.subscribe(createSubscriber("one"));
    chatMessages$.subscribe(createSubscriber("two"));

  }

  hotcold_pt3() {

    /*
     Control when you need to unsubscribe from a cold obsv that has been converted to a hot obsv
     */

    const simple$ = new Rx.Observable(observer => {
      observer.next("one");
      observer.next("two");
      observer.complete();

      return () => {
        console.log("unsubscribe");
      };
    });

    const published$ = simple$.publishLast(); // only fires once the observable COMPLETES and we are CONNECTED();

    published$.subscribe(createSubscriber("one"));
    published$.subscribe(createSubscriber("two"));
    const connection = published$.connect();

    //Clean up
    connection.unsubscribe();
  }

  hotcold_pt4() {

    /*
     Automatically handle when the connection and unsubscription of a connectable obsrv
     */

    const simple$ = new Rx.Observable(observer => {
      observer.next("one");
      observer.next("two");
      observer.next("three");

      return () => {
        console.log("unsubscribe");
      };
    });

    // will connect on the first subscription and disconnect once the last subscription has unsubscribed
    // So if you dont unsubscribe from sub2 - both obsrvables will not be disposed of.

    // const published$ = simple$.publish().refCount();
    const published$ = simple$.share(); //this does the same as above

    const sub1 = published$.subscribe(createSubscriber("one"));
    const sub2 = published$.subscribe(createSubscriber("two"));

    //Clean up
    sub1.unsubscribe();
    sub2.unsubscribe();
  }

  primaryOperators() {

    // Do something with each value from range before it goes to map
    // creates a sideeffect
    // Rx.Observable.range(1, 10)
    //   .do( a => console.log(`From do ${a}`))
    //   .map( a => a * a )
    //   .subscribe(createSubscriber("simple"));

    // Finally is a way to create a side-effect once the "range" COMPLETES
    // Rx.Observable.range(1, 10)
    //   .finally( a => console.log(`From do finally`))
    //   .map( a => a * a )
    //   .subscribe(createSubscriber("simple"));

    // Filter
    // Rx.Observable.range(1, 10)
    //   .filter( a => a < 5)
    //   .subscribe(createSubscriber("filter"));

    // Cold obsv - a new interval will happen everytime we subscribe to this
    // Here will tell it to start with a value of some kind before it starts with 0
    Rx.Observable.interval(1000)
      .startWith(5)
      .take(5)
      .subscribe(createSubscriber("interval"));

  }

  mergeConcat() {

    // Rx.Observable.interval(1000)
    //   .merge(Rx.Observable.interval(500))
    //   .take(7)
    //   .subscribe(createSubscriber("merge"));

    //Alternate way to write merge
    // Rx.Observable.merge(
    //   Rx.Observable.interval(1000).map( i => `${i} seconds`),
    //   Rx.Observable.interval(500).map( i => `${i} half-seconds`)
    // )
    // .take(10)
    // .subscribe(createSubscriber("merge"));

    Rx.Observable.range(1, 5)
      .concat(Rx.Observable.range(10, 3))
      .subscribe(createSubscriber("concat1"));

  }

  map() {

    // manual example of mapping over an array and passing it a function
    function arrayMap( array, projection ) {
      const returnArray = [];
      for ( let item of array ) {
        returnArray.push(projection(item));
      }

      return returnArray;
    }

    const test = arrayMap([ 1, 2, 3 ], a => a * a);
    console.log(test);

    function arrayMergeMap( array, projection ) {
      const returnArray = [];

      for ( let item of array ) {
        const projectedArray = projection(item);

        for ( let projected of projectedArray ) {
          returnArray.push(projected);
        }
      }

      return returnArray;

    }

    const albums = [
      {
        title: "album 1",
        tracks: [
          { id: 1, title: "track 1" },
          { id: 2, title: "track 2" },
          { id: 3, title: "track 3" }
        ]
      },
      {
        title: "album 2",
        tracks: [
          { id: 1, title: "track 1" },
          { id: 2, title: "track 2" },
          { id: 3, title: "track 3" }
        ]
      }
    ];

    //get list of all the tracks
    const tracks = arrayMergeMap(albums, album => album.tracks);
    console.log(tracks);

    // Rx.Observable.interval(1000)


  }

  rxMap() {
    //return a merge and map at the same time
    //without mergeMap - it will just return an array not as an individual item
    //then use from to convert each array item as a seperate value - and mergeMap puts them all into the same stream 
    Rx.Observable.fromPromise(getTracks())
      .mergeMap(tracks => Rx.Observable.from(tracks))
      .subscribe(createSubscriber("tracks"));


    function getTracks() {
      return new Promise(( resolve, reject ) => {
        setTimeout(() => {
          resolve([ "track 1", "track 2", "track 3" ]);
        }, 3000);
      });
    }

    function query( value ) {
      return new Promise(( resolve, reject )=> {
        setTimeout(()=> {
          resolve("this is the value");
        }, 1500);
      });
    }

    //Example showing that mergeMap will wait for the promise to resolve before it merges it
    Rx.Observable.of("my query")
      .do(()=> console.log("querying"))
      .mergeMap(a => query(a)) // replace "my query" with promise value
      .do(()=> console.log("After querying"))
      .subscribe(createSubscriber("query"));
  }

  arrayReduce(){

    // Loop over every item and invoke the accumulator function
    // Pass in what we have accumlated already and the current item in the array.
    function jsReduce( array, accumulator, startValue ) {
      let value = startValue;

      for (let item of array){
        value = accumulator(value, item);
      }

      return value;
    }

    const values = [ 342, 432, 23, 1, 4];
    const add = (acc, i) => acc + i; //define what the accumlator does here
    //add all the numbers together
    const sum = jsReduce(values, add, 0);

    console.log(`Total: ${sum}`);

    //find the largest number
    const max = jsReduce(
      values,
      function ( acc, value ) {

        //if the value we received is larger than the value we currently have
        if (value > acc){
          return value;
        }else{
          return acc;
        }
      },
      -1
    );

    console.log(`Max: ${max}`);

  }

  rxReduce(){

    // add each consecutive number to the last and return the final total
    Rx.Observable.range(1, 10)
      .reduce( (acc, value) => {
        return acc + value;
      }, 0 )
      .subscribe(createSubscriber("reduce"));
  }

  rxScan(){

    //Scan is good at processing values as they come in because we dont need the observable
    // to COMPLETE
    Rx.Observable.range(1, 10)
      .merge(Rx.Observable.never())
      .scan( (acc, value) => {
        return acc + value;
      }, 0 )
      .subscribe(createSubscriber("reduce"));

  }

  createInterval$( time ) {
    return new Rx.Observable(observer => {
      let index = 0;
      let interval = setInterval(() => {

        //this is an example of a memory leak
        console.log(`Generating ${index}`);

        observer.next(index++);
      }, time);

      //this return is only called when we unsubscribe from this observable
      return () => {
        clearInterval(interval);
      };
    });
  }

  createElement() {
    super.createElement();

    // this.partOne();
    // this.partTwo();
    // this.builtIns();

    // this.hotcold_pt1();
    // this.hotcold_pt2();
    // this.hotcold_pt3();
    // this.hotcold_pt4();

    // this.primaryOperators();

    // this.mergeConcat();

    // good example of double loops and functions
    // this.map();
    // this.rxMap();

    // this.arrayReduce();
    // this.rxReduce();
    this.rxScan();

  }

  getElementString() {
  return `
    <div>
    
      <div class="page-item">
          <h1>Observables Part: 1</h1>
          <h3 class="subhead">An observable is simply a generator function that accepts and observer and accepts and invokes the next or complete methods on it. </h3>
          
          <ul>
              <li>Basic Observable example</li>
              <li>Error Observable example</li>
              <li>Second Subscription with the same original Observable example</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables Part: 2</h1>
          <h3 class="subhead">Manipulate Observables with Operators. Operators listen to a source and omits to a destination and performs a transformation.</h3>
          
          <ul>
              <li>Subscribe/Unsubscribe example</li>
              <li>Subscribe helper function</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables Part: 3 - Built In Operators</h1>
          <h3 class="subhead"><a target="_blank" href="http://reactivex.io/documentation/operators.html">RX Operators Ref</a></h3>
          
          <ul>
              <li>interval</li>
              <li>Of</li>
              <li>From</li>
              <li>Defer - not totally sure when to use</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables: - Hot vs. Cold</h1>
          <h3 class="subhead"></h3>
          
          <ul>
              <li>Hot: Produce events reguardless if you are listening or not. Example is keyEvent using fromEvent.</li>
              <li>Cold: When you subscribe to it - thats when it starts doing something.</li>
              <li>Convert cold to hot observable.</li>
              <li>Publish, share, refcount - good for connecting to socket.io or websockets</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables: Primary Operators</h1>
          <h3 class="subhead">Do / Finally / Startwith/ Filter</h3>
          
          <ul>
              <li>Hot: Produce events reguardless if you are listening or not. Example is keyEvent using fromEvent.</li>
              <li>Cold: When you subscribe to it - thats when it starts doing something.</li>
              <li>Convert cold to hot observable.</li>
              <li>Publish, share, refcount - good for connecting to socket.io or websockets</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables: Merge / Concat</h1>
          <h3 class="subhead"></h3>
          
          <ul>
              <li>Merge will take 2 streams and just merge them together into one stream no matter when values are being passed in.</li>
              <li>Concat will put 2 streams together but it will only start the 2nd stream once the first stream has completed.</li>
          </ul>
      </div>
      
      <div class="page-item">
          <h1>Observables: Map / MergeMap / SwitchMap</h1>
          <h3 class="subhead"></h3>
          
          <ul>
              <li>mergeMap can take an observable and mereg the different streams into one stream</li>
              <li>SwitchMap does the same thing as mergeMap - but it waits until the observable passed into it COMPLETES then it spits out the value. See the RxAuto-Complete for ref.</li>
          </ul>
      </div>
      
      <div class="page-item">
        <h1>Observables: Reduce / Scan </h1>
        <h3 class="subhead"></h3>
        
        <ul>
            <li>Reduce is similare to JS version of Reduce</li>
            <li>Scan is like reduce but it can work with Hot Observables - meaning it doesnt need a "complete" to initiate itself.</li>
            <li>If an observable doesnt complete - Reduce will never fire.</li>
        </ul>
      </div>
      
      <div class="page-item">
        <h1>Observables: Buffer / ToArray </h1>
        <h3 class="subhead"></h3>
        
        <ul>
          <li>Reduce is similare to JS version of Reduce</li>
        </ul>
      </div>
        
    </div>
  `;
  }

}