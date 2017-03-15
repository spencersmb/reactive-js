/* eslint-disable no-console */
import $ from 'jquery';
import { Navbar } from './ui/navbar';
import basic_autocomplete from './autocomplete/auto-jquery';
import rxjs_autocomplete from './autocomplete/auto-rxjs';

import {HomePage} from './home-page';


class App {

    constructor(){
        this.routeMap = {};
        this.defaultRoute = null;
        this.nav = new Navbar('RX JS INTRO');

        this.addRoute('Home', new HomePage(), true);
        this.addRoute('Jquery AutoComplete', null);
        this.addRoute('RXJS AutoComplete', null);
    }

    buildNav(){
        this.nav.prependToElement($('body'));

        if(this.defaultRoute){
            this.activateRoute(this.defaultRoute);
        }
    }

    addRoute(id, pageObject, defaultRoute = false){

        //add a link 
        this.nav.addLink(id, '');

        //map of all routes
        this.routeMap[id] = pageObject;

        if(defaultRoute){
            this.defaultRoute = id;
        }
    }

    init(){
        console.log('App init');

        this.buildNav();

        basic_autocomplete.init();
        rxjs_autocomplete.init();
    }

}

const myApp = new App();

myApp.init();