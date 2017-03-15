
/* eslint-disable no-console */
import $ from 'jquery';

class BasicAc {

    constructor() {
        this.$title = $('#title');
        this.$results = $('#results');
        this.lastQuery = null;
        this.lastTimeout = null;
        this.nextQueryId = 0; //give each query a unqie ID so they come in order
    }

    init() {
        console.log('juqery Basic AutoComplete');

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
                    })
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

}

let basic_autocomplete = new BasicAc();

export default basic_autocomplete;