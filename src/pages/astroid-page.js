import {BaseElement} from '../ui/base-element';
import {Astroid} from '../astroid/astroid';


/*
 Once a page is created using the NEW keyword, Create element is called which creates the HTML for this page
 So after super.createElement(); adds html to the page, we create NEW content that we want to add to the page.

 Any interactivity for content on this page must be created in the element itself and not via this page.

 */
export class AstroidPage extends BaseElement {

  constructor(){
    super();
  }

  createElement(){

    super.createElement();
    let ac = new Astroid();
    ac.appendToElement(this.$element);

  }

  getElementString(){
    return `
        <div>
            <h1>Astroid Game</h1>
        </div>
      `;
  }

}