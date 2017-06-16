function State(name, accept_states) {
    if (typeof name !== "string") {
        throw new Error("name is not a string");
    }
    this.name = name;
    this.transitions = [];
    this.isAccept = accept_states.indexOf(name) >= 0;
}

var _ = State.prototype;

/**
 * This function sets up the transitions between states after all the states have been created
 * @param  {Array} states      The list of all the states in the Automata
 * @param  {Array} transitions The list of valid transitions for the Automata (see {Automata} for the format)
 */
_.setUpTransitions = function (states, transitions) {
    transitions.filter(transition => transition[0] === this.name)
        .forEach(transition => this.transitions.push({
            fn: transition[2],
            next: states.find(state => state.name === transition[1])
        }));
};

/**
 * The function tries to transition to the next state given the last token in the list and the defined transitions on this state
 * @param  {Array}    tokens List of tokens (in reverse order)
 * @param  {Function} cb     The function that is used to send back success or failure to the caller
 */
_.transition = function (tokens, cb, state = {}) {
    let token = tokens.pop();
    if (token == null) {
        if (this.isAccept) {
            return cb(true);
        }
        return cb(false, "Ended on " + this.name + " which is not an accept_state");
    }
    if (!this.transitions.some(transition => {
        if (transition.fn(token, state)) {
            transition.next.transition(tokens, cb, state);
            return true;
        }
        return false;
    })) {
        cb(false, "Ended on " + this.name + " with " + token  + " which does not have a valid transition");
    }
}

module.exports = State;
