import {BaseElement} from './ui/base-element';
import {RXJS_Ac} from './autocomplete/auto-rxjs';


/*
 Once a page is created using the NEW keyword, Create element is called which creates the HTML for this page
 So after super.createElement(); adds html to the page, we create NEW content that we want to add to the page.

 Any interactivity for content on this page must be created in the element itself and not via this page.

 */
export class RXJSAutoComplete extends BaseElement {

  constructor(){
    super();
  }

  createElement(){

    super.createElement();
    let ac = new RXJS_Ac();
    ac.appendToElement(this.$element);

  }

  getElementString(){
    return `
        <div>
            <h1>RXJS Autocomplete</h1>
        </div>
      `;
  }

}