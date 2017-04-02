/* eslint-disable no-console */
import {BaseElement} from '../ui/base-element';
import $ from 'jquery';
import {Observable} from 'rxjs/Rx';

export class WikiAc extends BaseElement{

  constructor() {
    super();
    this.textbox = "";
    this.results = "";
    this.searchButton = "";
    this.searchButtonClicks = "";
    this.searchForm = "";
    this.searchIsOpen = "";
    this.keypresses = "";
    this.searchResultsSets = "";
    this.person = {
      name: "jim",
      age: 23
    };
  }

  init() {
    console.log('Wiki AutoComplete From Front End Masters');

    this.viewModelBinding();

    this.textbox = this.$element.find('#textbox');
    this.results = this.$element.find('#results');
    this.searchButton = this.$element.find('#searchButton');
    this.searchForm = this.$element.find('#searchForm');

    /*
    Create observable for the textbox and searchButton - doesnt fire until subscribed to
     */
    this.searchButtonClicks =
      Observable.fromEvent(this.searchButton, 'click');

    this.keypresses =
      Observable.fromEvent(this.textbox, 'keyup');

    /*
     Create a variable assigned to searchButton that will fire when the button is clicked
     this will open when the observable is clicked
     */
    this.searchFormOpens =
      this.searchButtonClicks
        //We use Do here so that we know it will fire Right before the result gets pushed through the subscriber
        .do( (v) => {
          this.searchForm.css('display', 'block');
        });

    /*
     Create a variable assigned to searchButton that will fire when the button is clicked
     */
    this.searchResultsSets =
      this.searchFormOpens.map( (e) => {


        /*
         Handle Closing Button
         */
        let close = this.$element.find('#close');
        let closeButtonClicks = Observable.fromEvent(close, 'click');
        let searchFormCloses = closeButtonClicks.do(
          () => {
            this.searchForm.css('display', 'none');
            this.results.val('');
            this.textbox.val('');
          }
        );

        /*
         When the SearchButton is clicked - create the formObservable
         */
        return this.keypresses
          .debounceTime(500)
          .map((key)=> this.textbox.val().trim()) //dont allow spaces to trigger search
          .distinctUntilChanged()
          .filter( (search) => search.trim().length > 0 ) //dont search if blank
          .switchMap((phrase)=> this.getWikiSearchResults(phrase).retry(3)) //retry if fail - see pluarlsight fail function
          .takeUntil(searchFormCloses); //keep this observable open until we click close button

      } ).switch(); //switch to the latest obsrv and kill the original obsrv - safety so we dont create multiple obsrvers


      /*
      Finally kick off the event and subscribe to searchResultsSet which is ultimately a ref to
      the Searchbutton observable.
       */
      this.searchResultsSets.subscribe(
        r => {
          this.results.val(JSON.stringify(r));
        },
        error => console.log(error)
      );

  }

  viewModelBinding(){
    let name= this.$element.find('#name');
    let age= this.$element.find('#age');


    Observable.fromEvent(name, 'change');

    //Video - binding Between views
    // Observable.ofObjectChanges(this.person);

  }

  //simulate network request with promise
  getWikiSearchResults(term){
    console.log('search');
    let requestUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + encodeURIComponent(term) + '&callback=?';
    return Observable.fromPromise($.getJSON(requestUrl));
  }

  getItems(title) {
    console.log('Querying Items');

    return new Promise((resolve, reject) => {

      window.setTimeout(() => {
        resolve([
          title,
          "Item 2",
          `Another ${Math.random()}`
        ]);
      }, 500 + (Math.random() * 200));

    });
  }

  createElement(){
    super.createElement();
    this.init();
  }

  getElementString(){
    return `
        <div>
          <button id="searchButton">Search</button>
          <button id="close">Close(X)</button>
          <div id="searchForm" style="display:none">
            <input id="textbox" type="text">
            <textarea name="" id="results" cols="30" rows="10"></textarea>
          </div>
          
          <h2>Binding Between view + model</h2>
          
            <div>
                name: <input type="text" id="name">
                <br/>
                <br/>
                age: <input type="text" id="age">
            </div>
        </div>
        `;
  }

}