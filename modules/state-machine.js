function StateMachine(states, currentState) {
  if (!Array.isArray(states)) {
    throw new Error('Argument "states" must be of array type');
  }
  // *************************************************************************
  this.states = states; //array
  this.substates = {};

  this.getState = () => {
    return this.state;
  };

  this.attachSubStateTo = function(state, substates, initialSubstate) {
    // TODO : check if "state" arg is valid, does the state exist?
    this.substates[state] = new StateMachine(substates, initialSubstate);
  };

  this.setState = state => {
    if (this.states.includes(state)) {
      this.currentState = state;
      return this.substates[state];
    } else {
      throw new Error("Invalid argument: " + state);
    }
  };
  //
  if (currentState === undefined) {
    throw new Error('Missing required second argument "currentState"');
  } else {
    this.setState(currentState);
  }
}

module.exports = {
  StateMachine: StateMachine
};
