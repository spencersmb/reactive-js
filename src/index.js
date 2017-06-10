/* eslint-disable no-console */
import $ from 'jquery';
import { Navbar } from './ui/navbar';
import {BaseElement} from './ui/base-element';

import {HomePage} from './home-page';
import {JqueryAutoComplete} from './ac-jquery-page';
import {RXJSAutoComplete} from './ac-rx-page';
import {Obsv_1} from './pages/obs-pt1-page';
import {Twitter_sidebar} from './pages/twitter-sidebar';
import {WikiPage} from './pages/wikiSearch-page';
import {ReduxClonePage} from './pages/redux-clone-page';
import {DragDropPage} from './pages/drag_n_drop-page';
import {AstroidPage} from './pages/astroid-page';

require('style-loader!css-loader?-autoprefixer!postcss-loader!sass-loader!applicationStyles');


class App extends BaseElement{

    constructor(){
        super();
        this.routeMap = {};
        this.defaultRoute = null;
        this.nav = new Navbar('RX JS INTRO');

        //Create Routes Object 
        this.addRoute('Home', new HomePage());
        this.addRoute('Basics', new Obsv_1());
        this.addRoute('Jquery AutoComplete', new JqueryAutoComplete() );
        this.addRoute('RXJS AutoComplete', new RXJSAutoComplete());
        this.addRoute('Twitter Box', new Twitter_sidebar());
        this.addRoute('Wiki Search', new WikiPage());
        this.addRoute('Redux Clone', new ReduxClonePage());
        this.addRoute('Drag N Drop', new DragDropPage(), true);
        this.addRoute('Astroid Game', new AstroidPage());
    }

    buildNav(){
        // Add the Navigation to the page
        this.nav.prependToElement($('body'));
        
        //setup click handlers for JS to handle
        //$element is a jquery objec that gets created when the Class is first instantiated
        //this $element contains all the html for itself in a jquery wrapped object
        this.nav.$element.find('.navbar-links a').click((e) => {
            
            //get the innerText of the element which is also the ID of the route
            //then activate it
           let route = e.target.innerHTML;
            this.activateRoute(route);
        });

        if(this.defaultRoute){
            this.activateRoute(this.defaultRoute);
        }
    }

    activateRoute(route){
        
        //get the content of the page - clear it and append the new content of the element
        
        let content = this.nav.$element.find('.page-content');
        content.empty();

        this.routeMap[route].appendToElement(content);
    }

    
    /*
     id = Text of Link
     pageObject = the Class of the page being constructed
     defaultRoute = only used for the home page
     */
    addRoute(id, pageObject, defaultRoute = false){

        //add a link to NAV Class instantiated Element
        this.nav.addLink(id);

        //map of all routes based on ID (text of the link)
        this.routeMap[id] = pageObject;

        if(defaultRoute){
            this.defaultRoute = id;
        }
    }

    init(){
        console.log('App init');

        this.buildNav();
    }

}

const myApp = new App();

myApp.init();