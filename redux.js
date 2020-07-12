
  // 1.创建一个容器 返回三个函数 其中getsate这个函数是获取到最新的状态 dispatch这个函数是派发一些动作 更新我们的状态 subcribe这个函数是订阅我们的状态
  // 当状态发生改变的时候 我们要做的事情 是一个发布订阅 用户要做的事情全部放到一个事件池里面  当执行完后才能以后移除事件池

  // 2.createStore是一个函数 参数是 reducer  reducer是另外一个函数 这个函数主要是更改我们的状态 reducer有两个参数 一个是type 一个是action type是
  // 匹配动作的类型 action是匹配动作类型要做的事  reducer这个函数是用户需要做的事情 

  // 核心就是增加修改数据的成本 

  // 应用redux 的流程
  // 1. 定义要做事情的类型 
  // 2.reducer函数匹配动作进行修改
  // 3.应用redux创建容器 let store = createStore(reducer)
  // 4.调用dispatch({type:'',dosomething:''}) 进行动作派发 默认渲染一次 进行初始化状态
  // 5.订阅状态subcrib（） 更新视图
 
  function createStore (reducer){
    let state ={}
    let getState = ()=>{
      state =  JSON.parse(JSON.stringify(state))
    }
    let dispatch = action =>{
      state = reducer(type,action)
      listeners.forEach(item=>item())
    }
    dispatch({})
    let listeners= []
    let subcribe = (fn)=>{
      listeners.push(fn)
      return function (){
        listeners = listeners.filter(item=>item!==fn)}
    }
    return { getState, dispatch , subcribe }
  }
  let store = createStore (reducer)