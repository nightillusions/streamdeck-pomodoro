import React, { Component } from 'react';

export class SpanElement extends Component<{}> {
  render() {
    return (
      <span className="clickable" value="100">
        100
      </span>
    );
  }
}

export default SpanElement;
