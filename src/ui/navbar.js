import {BaseElement} from './base-element';

export class Navbar extends BaseElement {
    constructor(title){
        super();
        this.title = title;
        this.links = [];
    }

    addLink(title, href){
        this.links.push({
            href,
            title
        })
    }

    //This is the template method for defining HTML strings
    //we then you createElement to instantiate it
    getElementString(){

        //Create a string that contains our links
        let links = '';

        for ( let link of this.links ){
            links += `<a href="${link.href}" >${link.title}</a>\n`
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
            default content
            </div>
        </div>
        `
        ;
    }
}