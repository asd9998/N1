import _ from 'underscore'
import React from 'react'
import {VirtualDOMUtils} from 'nylas-exports'
// import SearchableComponentStore from './flux/stores/searchable-component-store'

class SearchableComponent {
  componentWillMount(superMethod, ...args) {
    if (superMethod) superMethod.apply(this, args)
  }

  componentWillUnmount(superMethod, ...args) {
    if (superMethod) superMethod.apply(this, args)
  }

  componentDidUpdate(superMethod, ...args) {
    if (superMethod) superMethod.apply(this, args)
  }

  _matchesSearch(vDOM) {
    return VirtualDOMUtils.some(vDOM, (element) => {
      if (typeof element === "string") {
        // TODO
        return false
      }
    })
  }

  _highlightSearch(vDOM) {
    // TODO
  }

  render(superMethod, ...args) {
    if (superMethod) {
      const vDOM = superMethod.apply(this, args);
      if (this._matchesSearch(vDOM)) {
        return this._highlightSearch(vDOM)
      }
      return vDOM
      // console.log(vDOM);
      // React.children
      // const newChildren = this.cloneAndModify(vDOM.props.children);
      // const newvDOM = this.cloneAndModify(vDOM)

      // const newDOM = React.addons.update(vDOM, {});
      // const newDOM = React.cloneElement(vDOM);
      // console.log(vDOM, newDOM);
      // console.log(vDOM === newDOM); // false
      // console.log(vDOM.props.children === newDOM.props.children); // true
      // return newDOM;
      // const walker = VirtualDOMUtils.walk(vDOM);
      // walker.next();
      //
      // console.log(vDOM);
      // return vDOM
    }
  }

  cloneAndModify(superMethod, element) {
    // if (element && element.constructor.name === "String") {
    //   // return React.cloneElement(element, [], "TEST")
    //   return element
    if (React.isValidElement(element)) {
      const children = React.Children.map(element.props.children, (child) => {
        this.cloneAndModify(child)
      });
      return React.cloneElement(element, [], children)
      // element.props.children = children
      // return element
    }
    return element

    // return React.Children.map(children, (child) => {
    //   return child;
    //   // if (React.isValidElement(child)) {
    //   //   const newChildren = this.cloneAndModify(null, child.props.children);
    //   //   return React.cloneElement(child, {}, newChildren)
    //   // } else if (child.constructor.name === "String") {
    //   //   return "TEST"
    //   // }
    //   // return child
    // });
  }
}

// React.Children.forEach does not behave as you'd expect. When it gets
// to leaf nodes, the callback gets passed the leaf node istelf instead
// of `null` or a `string` in the case of a text node. As a result we
// have to manually traverse the React vDOM without the React.Children
// helper methods :(
// React.Children.map = (test, fn) => {
// }

/**
 * Takes a React component and makes it searchable
 */
export default class SearchableComponentMaker {
  static extend(component) {

    let context = component.contextTypes || {}
    component.contextTypes = Object.assign(context, {
      searchTerm: React.PropTypes.string
    });

    const proto = SearchableComponent.prototype
    for (const propName of Object.getOwnPropertyNames(proto)) {
      if (propName === "constructor") continue;
      const origMethod = component.prototype[propName]
      component.prototype[propName] = _.partial(proto[propName], origMethod)
    }
    return component
  }
}
