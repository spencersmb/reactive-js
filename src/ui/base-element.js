import $ from 'jquery';


export class BaseElement {

    constructor(){
        this.$element = null; //jquery wrapped object
    }

    appendToElement(el){
        this.createElement();
        el.append(this.$element);
    }

    prependToElement(el){
        this.createElement();
        this.$element.prependTo(el);
    }

    createElement(){
        //Get the string and wrap it in a jquery object
        let s = this.getElementString();
        this.$element = $(s);
    }

    //base string of html that will be overwritten depending on the elemen that is extending this function
    getElementString(){

        throw 'Please override getElementString in BaseElement';

    }

}