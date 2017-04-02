/* eslint-disable no-console */
import {BaseElement} from '../ui/base-element';
import $ from 'jquery';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

export class ReduxClone extends BaseElement{

  constructor() {
    super();
    this.inputEl = "";
    this.activeEl = "";
    this.doneEl = "";

    //pass in default state
    this.state = '';


    // take the data and return an action with the data
    this.createTodo = this.dispatcher( data => ({type: 'CREATE_TODO', data}) );
    this.toggleTodo = this.dispatcher( data => ({type: 'TOGGLE_TODO', data}) );

   }

  li(todo){
    return`
        <li>
            ${todo.text}
        </li>
      `;
  }

  // dispatcher takes a fn(which is actionX) and returns a function that returns new appstate
  dispatcher(fn){
    return (...args) => this.state.next(fn(...args));
  }

  reducer(state, action){

    switch(action.type){
      case 'CREATE_TODO':
      return Object.assign( {},
        state,
        {
          todos: state.todos.concat([
            {
              text: action.data,
              done: false
            }
          ])
        });

      case 'TOGGLE_TODO':
        return Object.assign( {},
          state,
          {
            todos: state.todos.map( todo => {
              return todo.text === action.data ? Object.assign({}, todo, {done: !todo.done}) : todo;
            } )

          });

      default:
        return state || {};
    }

  }

  updateView(state){

    let activeText = state.todos
      .filter( todo => !todo.done)
      .map(this.li)
      .join('');

    let doneText = state.todos
      .filter( todo => todo.done)
      .map(this.li)
      .join('');

    this.activeEl.html(activeText);
    this.doneEl.html(doneText);

  }
  //THE LOOP
  //object to keep track of appState
  //Dom events
  //Dispatch Actions (based on dom events)
  //reducer - determined by actions being sent
  //updateView - which updates the state


  init() {
    console.log('Redux Clone from Deep Dive in Tuts Plus Rx.js');

    this.inputEl = this.$element.find('input');
    this.activeEl = this.$element.find('#active');
    this.doneEl = this.$element.find('#done');

    this.state = new BehaviorSubject({todos: []});

    // scan reduces but emits a new observable every time a new action comes in
    this.state.scan(this.reducer).subscribe(this.updateView.bind(this));

    Observable.fromEvent(this.inputEl, 'keyup')
      .filter(e => e.key === 'Enter')
      .map(e => e.target.value)
      .subscribe(text => {
        this.createTodo(text);
        this.inputEl.val('');
      });

    Observable.fromEvent( this.activeEl, 'click')
      .merge(Observable.fromEvent( this.doneEl, 'click'))
      .filter( e => e.target.matches('li'))
      .map(e => e.target.innerText.trim())
      .subscribe(this.toggleTodo);

  }

  createElement(){
    super.createElement();
    this.init();
  }

  getElementString(){
    return `
        <div>
          <input type="text">
          
          <h3>Active Todos</h3>
          <ul id="active"></ul>
          
          <h3>Done Todos</h3>
          <ul id="done"></ul>
        </div>
        `;
  }

}