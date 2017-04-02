/* eslint-disable no-console */
import { BaseElement } from '../ui/base-element';
import Rx from 'rxjs/Rx';
import $ from 'jquery';

/*
 Once a page is created using the NEW keyword, Create element is called which creates the HTML for this page
 So after super.createElement(); adds html to the page, we create NEW content that we want to add to the page.

 Any interactivity for content on this page must be created in the element itself and not via this page.

 */
export class Twitter_sidebar extends BaseElement {

  constructor() {
    super();
    this.requestStream = '';
    this.responseStream = '';
    this.refreshButton = '';
    this.refreshClickStream = '';
    this.requestOnRefreshStream = '';
  }

  apiCall(){
    // this.requestStream
    //   .flatMap( (requestUrl) => {
    //     return Rx.Observable
    //   })
  }

  createElement() {
    super.createElement();

    //buttons
    this.refreshButton = this.$element.find('.refresh');
    const close1Button = this.$element.find('.close1');
    const close2Button = this.$element.find('.close2');
    const close3Button = this.$element.find('.close3');

    const close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');
    const close2ClickStream = Rx.Observable.fromEvent(close2Button, 'click');
    const close3ClickStream = Rx.Observable.fromEvent(close3Button, 'click');

    // click event stream
    this.refreshClickStream = Rx.Observable.fromEvent(this.refreshButton, 'click');

    //On page load
    //on click refresh the request stream with new data from the api
    this.requestStream = this.refreshClickStream
      .startWith('startup click') //supposidy inits with a click right away
      .map( () => {
        let randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset;
      });


    // flatMap converts each response Item into its own observable
    this.responseStream = this.requestStream
      .flatMap( (requestUrl) => {
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
      });


    //subscribe to our stream
    this.responseStream
      .subscribe(
        v => console.log(v),
        e => console.log("error"),
        () => console.log("complete")
      );

    const createSuggestionStream = ( closeClickStream ) => {
      return closeClickStream
        .startWith('startup click')
        .combineLatest( this.responseStream, (click, listUsers) => {
          return listUsers[Math.floor(Math.random()*listUsers.length)]
        })
        // merge a null value when the refresh happens to CLEAR the data
        .merge(
          this.refreshClickStream.map( () => null)
        )
        //Start with a null value so nothing is rendered right away.
        .startWith(null);
    }

    //STREAM USER 1
    const suggestion1Stream = createSuggestionStream(close1ClickStream);
    const suggestion2Stream = createSuggestionStream(close2ClickStream);
    const suggestion3Stream = createSuggestionStream(close3ClickStream);

    //Subscribe to stream1 and render to client
    suggestion1Stream
      .subscribe(
        suggestedUser => {
          this.renderSuggestion(suggestedUser, '.suggestion1');
        }
      );

    suggestion2Stream
      .subscribe(
        suggestedUser => {
          this.renderSuggestion(suggestedUser, '.suggestion2');
        }
      );

    suggestion3Stream
      .subscribe(
        suggestedUser => {
          this.renderSuggestion(suggestedUser, '.suggestion3');
        }
      );


  }

  renderSuggestion(suggestedUser, selector){
    let suggestionEl = this.$element.find(selector);

    if(suggestedUser === null ){
      suggestionEl.hide();
    }else{
      suggestionEl.show();
      let usernameEl = suggestionEl.find('.username');
      usernameEl.attr('href', suggestedUser.html_url);
      usernameEl.text(suggestedUser.login);

      let imgEl = suggestionEl.find('img');
      imgEl.attr('src' , suggestedUser.avatar_url );
    }

  }

  getElementString() {
    return `
    <div>
      <h1>Twitter Box</h1>
      <div class="container">
        <div class="header">
             <h2>Who to follow</h2><a href="#" class="refresh">Refresh</a>
        </div>
        <ul class="suggestions">
            <li class="suggestion1">
                <img style="max-width: 100px" />
                <a href="#" target="_blank" class="username">this will not be displayed</a>
                <a href="#" class="close close1">x</a>
            </li>
            <li class="suggestion2">
                <img style="max-width: 100px" />
                <a href="#" target="_blank" class="username">neither this</a>
                <a href="#" class="close close2">x</a>
            </li>
            <li class="suggestion3">
                <img style="max-width: 100px" />
                <a href="#" target="_blank" class="username">nor this</a>
                <a href="#" class="close close3">x</a>
            </li>
        </ul>
    </div>
    </div>
  `;
  }

}