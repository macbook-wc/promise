import React from 'react';
import propTypes from 'prop-types';
// 测试
class Provider extends React.Component {
  static childContextPropTypes = {
    store: propTypes.object
  };
  static getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}
let Connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
  return class Proxy extends React.Component {
    constract(props, context) {
      super();
      this.state = mapStateToProps(context.store.getState());
    }
    componentDidMount() {
      this.context.store.subscribe(() => {
        this.setState(mapStateToProps(context.store.getState()));
      });
    }
    static contextTypes = {
      store: PropTypes.object
    };
    render() {
      return (
        <Component
          {...this.state}
          {...mapDispatchToProps(this.context.store.dispatch())}
        />
      );
    }
  };
};
export default { Provider, Connect };

// 1.react-redux provider作为所有子组件的父主件 通过context定义子组件的上下文类型 并且获取到子组件的上下文 并且渲染所有的子组件 子组件定义自己的上下文类型 家就可以获取到父组件的属性和状态
// 2.connect 是一个高阶组件 目的是把父组件的state和props变成自己的属性 通过mapStateToProps mapDispatchToProps来实现 参数分别是获取到父组件的属性和状态
// 3.视图更新的部分作为公共逻辑放在了Proxy代理组件部分 目标逐渐只要操作数据和动作就可以触发试图更新
