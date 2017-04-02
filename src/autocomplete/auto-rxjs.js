/* eslint-disable no-console */
import {BaseElement} from '../ui/base-element';
import $ from 'jquery';
import Rx from 'rxjs/Rx';

export class RXJS_Ac extends BaseElement{

    constructor() {
        super();
    }

    init() {
        console.log('RxJS AutoComplete');

        this.$title = this.$element.find('#rx-ac-input');
        this.$results = this.$element.find('#rx-ac-results');

        Rx.Observable.fromEvent(this.$title, "keyup")
            .map( e => e.target.value)
            .distinctUntilChanged()
            .debounceTime(500)
            .switchMap(this.getItems) //merge all events and ensures that allevents are upto date, and any stale events are disposed of.
            //flatMap merges all items but not in order
            .subscribe(items => {
                this.$results.empty();
                this.$results.append(
                  items.map( r => $(`<li />`).text(r) )
                );
            });
    }

    //simulate network request with promise
    getItems(title) {
        console.log('Querying Items');

        return new Promise((resolve, reject) => {

            window.setTimeout(() => {
                resolve([
                    title,
                    "Item 2",
                    `Another ${Math.random()}`
                ]);
            }, 500 + (Math.random() * 200));

        });
    }

    createElement(){
        super.createElement();
        this.init();
    }

    getElementString(){
        return `
        <div id="rxa-app">
          <input type="text" id="rx-ac-input">
          <ul id="rx-ac-results">
            
          </ul>
        </div>
        `;
    }

}