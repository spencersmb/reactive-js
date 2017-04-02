/* eslint-disable no-console */
import {BaseElement} from './base-element';
import Rx from 'rxjs/Rx';
import $ from 'jquery';


export class Navbar extends BaseElement {
    
    constructor(title){
        super();
        this.title = title;
        this.links = [];
        this.navPosition = 0;
    }

    addLink(title){
        this.links.push({
            title
        });
    }

    checkNavPosition(){

        /*
        Animate in after 500px
        Animate out if less than 500px
        If we go straight to the top - remove animation completely
         */
        if(this.navPosition > 500) {
            this.navbar.removeClass('top-zero');
            this.navbar.addClass('scrolling');
        }else if(this.navPosition < 100){
            this.navbar.addClass('top-zero');
            this.navbar.removeClass('scrolling');
        }else{
            this.navbar.removeClass('scrolling');
        }
    }

    scrollObsrv(){

        //Window scroll event with small debounce
        const windowScrollEvent$ = Rx.Observable.fromEvent(window, "scroll")
          .debounceTime(250)
          .subscribe(
            () => {
               this.navPosition = document.body.scrollTop;
               this.checkNavPosition();
               // console.log(this.navPosition);
           }
          );

    }

    createElement() {
        super.createElement();
        this.navbar = this.$element.find('.navbar');
        this.checkNavPosition();
        this.scrollObsrv();
    }

    //This is the template method for defining HTML strings
    //we then you createElement to instantiate it
    getElementString(){

        //Create a string that contains our links
        let links = '';

        for ( let link of this.links ){
            links += `<a>${link.title}</a>\n`;
        }

        return `
        <div class="container">
            <div class="navbar">

                <div class="navbar-inner">

                    <div class="navbar-title">
                        ${this.title}
                    </div>

                    <div class="navbar-links">
                        ${links}
                    </div>

                </div>

            </div>
            <div class="page-content">
            default page content
            </div>
        </div>
        `
        ;
    }
}