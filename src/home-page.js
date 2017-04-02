import {BaseElement} from './ui/base-element';

export class HomePage extends BaseElement {

    constructor(){
        super();
    }

    createElement(){
        super.createElement();
    }

    getElementString(){
        return `
        <div>
            <h1>Observables Intro</h1>
            
            <h3>Observables:</h3>
            <p>Are things that produce values.</p>
            
            <hr>
            
            <h3>Operators:</h3>
            <p>A Things that modifies or transforms the data being pushed in by the observable. **Operators return observables**</p>
            
            <hr>
            
            <h3>Subscription</h3>
            <p>Do something with the values that are returned.</p>
            
        </div>
        `;
    }

}