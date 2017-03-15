

export class ApplicationBase {

    constructor(title){
        this.title = title;
        this.routeMap = {};
        this.defaultRoute = null;
    }

}

let Routes = new ApplicationBase('Rx JS Intro');

export default Routes;