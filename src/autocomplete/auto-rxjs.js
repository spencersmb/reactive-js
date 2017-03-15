/* eslint-disable no-console */
import $ from 'jquery';

class Rx_JS_Ac {

    constructor() {
        this.$title = $('#rx-ac-input');
        this.$results = $('#rx-ac-results');
    }

    init() {
        console.log('RxJS AutoComplete');
    }

    getItems(title) {
        console.log('Querying Items');

    }

}

let rxjs_autocomplete = new Rx_JS_Ac();

export default rxjs_autocomplete;