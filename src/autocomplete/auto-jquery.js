
/* eslint-disable no-console */
import $ from 'jquery';
import {BaseElement} from '../ui/base-element';


/*
    1. initialize variables we'll use in the constructor
    2. Assign HTML for this element in the GetElementString()
    3. After we create the jquery wrapped element using super.createElement(), initialize any JS events to that element
    4.
 */

export class BasicAc extends BaseElement{

    constructor() {
        super();
        this.$title = '';
        this.$results = '';
        this.lastQuery = null;
        this.lastTimeout = null;
        this.nextQueryId = 0; //give each query a unqie ID so they come in order
    }

    init() {
        console.log('jQuery Basic AutoComplete');

        this.$title = this.$element.find('#title');
        this.$results = this.$element.find('#results');

        this.createEvent();

    }

    createEvent(){
        this.$title.on("keyup", e => {
            const title = e.target.value;

            //Check if title value has changed before making api call
            if (title == this.lastQuery) {
                return;
            }

            this.lastQuery = title;



            //Check if we have a timeout - clear it if a new request came in
            if (this.lastTimeout) {
                window.clearTimeout(this.lastTimeout);
            }

            let ourQueryId = ++this.nextQueryId;// ensures that we are always in sync.

            //When a new request comes in set a new timeout to get the Items after 500 ms
            this.lastTimeout = window.setTimeout(() => {
                this.getItems(title)
                  .then(items => {

                      if( ourQueryId != this.nextQueryId ){
                          return;
                      }

                      this.$results.empty();

                      const $items = items.map(item => $(`<li />`).text(item));
                      this.$results.append($items);
                  });
            }, 500);


        });
    }

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
        <div id="jba-app">
            <input type="text" id="title">
            <ul id="results">
              
            </ul>
        </div>
        `;
    }

}

