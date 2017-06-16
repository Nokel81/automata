const State = require('./state');

/**
 * This is the constructor for the {Automata} object
 * @param       {Array~String} states        The list of valid state names
 * @param       {Array~Array}  transitions   The list of valid transitions
 *     @member {transition}
 *     @type   {Array~Mixed}
 *     @param  {String}      index_0            The name of the state which will be the origin of the transition
 *     @param  {String}      index_1            The name of the state which will be the destination of the transition
 *     @param  {function}    index_2            The accept function for a given token to take this transition
 *         @function {index_2}
 *         @param    {String}  token The token to be checked and if correct will the transition will be taken
 *         @param    {Object}  state The automata state object that can be used to store counters and check their values later
 *         @return   {Boolean}       Weather or not the token is accepted
 * @param       {Array~String} accept_states The list of accept states
 * @param       {String}       start_state   The name of the state to start the automata
 * @constructor
 */
function Automata(states, transitions, accept_states, start_state) {
    if (!Array.isArray(states)) {
        throw new Error("states is not an array");
    }
    if (!Array.isArray(transitions)) {
        throw new Error("transitions is not an array");
    }
    if (!Array.isArray(accept_states)) {
        throw new Error("accept_states is not an array");
    }
    states.forEach(state => {
        if (typeof state !== "string") {
            throw new Error("Not every state is a string");
        }
    });
    states.sort((a, b) => {
        if (a < b) {
            return -1;
        }
        if (a === b) {
            throw new Error("States have been defined multiple times: " + a);
        }
        return 1;
    });
    transitions.forEach(transition => {
        if (!Array.isArray(transition)) {
            throw new Error("Not every transition is an array");
        }
        if (transition.length !== 3) {
            throw new Error("Not every transition has only a `from`, a `to` state, and a transitional token function");
        }
        if (states.indexOf(transition[0]) < 0 || states.indexOf(transition[1]) < 0) {
            throw new Error("Not every transition's states are valid");
        }
        if (typeof transition[2] !== "function" || (transition[2].length != 1 || transition[2].length != 2)) {
            throw new Error("Not every transition's transitional token is a function with the correct number of parameters");
        }
    });
    transitions.sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] === b[0]) {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] === b[1]) {
                throw new Error("Not every transition is a unique arrow: " + a[1] + " -> " + b[1]);
            }
        }
        return 1;
    })
    accept_states.forEach(state => {
        if (typeof state !== "string") {
            throw new Error("Not every accept_state is a string");
        }
        if (states.indexOf(state) < 0) {
            throw new Error("Not every accept_state is a valid state");
        }
    });
    if (states.indexOf(start_state) < 0) {
        throw new Error("start_state is not a valid state");
    }
    let all_states = states.map(state => new State(state, accept_states));
    all_states.forEach(state => state.setUpTransitions(all_states, transitions));
    this.start = all_states.find(state => state.name === start_state);
}

var _ = Automata.prototype;

/**
 * This function goes through the provided tokens to check if they are valid according to the dfa
 * @param  {Array}   tokens This is a list of tokens in forward order
 * @param  {Function} cb     The function used to pass information back to caller
 *     @function {cb}
 *     @param    {Boolean} isValid            Whether or not the list of tokens is valid by the DFA
 *     @param    {String}  error   {optional} This error string on why the validation is false
 */
_.validate = function (tokens, cb) {
    this.start.transition(tokens.reverse(), cb);
};

module.exports = Automata;
