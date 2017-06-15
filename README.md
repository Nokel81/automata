# function-automata
This is a NodeJS Finite Automata package.

```javascript
const Automata = require('function-automata');
```

### constructor

```javascript
var automata = new Automata(states, transitions, accept_states, start_state);
```

###### states
This is an array of strings. These are the names of the nodes in the state machine.

###### transitions
This is an array of arrays of the following format:
1. {String} - name of the state that this transition will originate from
2. {String} - name of the state that is the destination of the transition
3. {function} - the function that determines if this transition is followed. The parameters are as follows:
 1. token {String} - the next token to be analysed
 2. state {Object} - the state machine data object. Here can be stored information that help with matching things like brackets

###### accept_states
This is an array of state names that count as accept states or if the machine ends on one of these then the matching is correct

###### start_state
This is the name of the state which will be first used to make transitions. Starting in the start state is assumed and does not consume a token. Likewise, a token must be consumed to traverse to the next state.

### validate
```javascript
automata.validate(tokens, callback);
```

###### tokens
This is an array of tokens to be validated. All empty strings or elements that are `== null` will be removed.

###### callback
This function is used to return the results back to the user. The function should have the following signature.

```javascript
function callback(isValid, error)
```
**isValid** {Boolean} - represents whether the tokens were accepted

**error** {String} - If `isValid` is false then this will tell why the state machine did not validate the tokens
