class Promise {
  constructor(callback) { // 2 所以Promise.constractor()要传一个函数
    // 4 Promise有三个状态 pending  fulfilled rejected  并且把这个状态挂载到实例上
    this.status = "pending"  // 5 new promise的时候
    this.value = nudefind // 6 执行之前是没有结果的 所以是执行的结果是nudefind
    // 12所以在执行之前是需要判定status的状态
    // 16 实例上挂载两个数组 this.fulfilledAry this.rejectedAry
    this.fulfilledAry = []
    this.rejectedAry = []
    let resolveFn = result => { // 8 定义一个成功的函数resolveFn 参数是成功函数执行的结果
      // 19 如不加定时器 then 直接执行 没有等待
      let timeOut = setTimeout(() => {
        clearTimeout(timeOut)
        //13 状态为pending时候 可以执行resolveFn 
        if (this.status !== "pending") return
        this.status = 'fulfilled'
        this.value = result
        this.fulfilledAry.forEach(item => item(this.value))//17 把成功函数数组执行
      }, 0);

    }
    let rejectFn = reason => {// 9 定义一个失败的函数resolveFn 参数是执行失败函数的结果
      // 19 如不加定时器 then 直接执行 没有等待 
      let timeOut = setTimeout(() => {
        clearTimeout(timeOut)
        //14 状态为pending时候 可以执行resolveFn 
        if (this.status !== "pending") return
        this.status = 'rejected'
        this.value = reason
        this.rejectedAry.forEach(item => item(this.value))//17把失败函数的函数组执行
      }, 0);

    }
    //20 如果callback执行失败直接走rejected 加一个异常捕获
    try { callback(resolveFn, rejectFn) } catch (err) {
      rejectFn(err)
    }
    callback(resolveFn, rejectFn); //7 所以callback执行 执行的是resolve reject 定义两个函数
  }
  // then(fulfilledCallBack, rejectedCallBack){// 15往实例上挂载一个then方法 成功的函数 成功的函数组 失败的函数组 
  //   this.fulfilledAry.push(fulfilledCallBack)
  //   this.fulfilledAry.push(rejectedCallBack)
  // }

  then(fulfilledCallBack, rejectedCallBack) {// 21 实现链式调用 then 必须返回一个全新的promise  这个全新的promise有两个函数作为参数 
    //22 依然要判断上一个then fulfilledCallBack rejectedCallBack 执行的成功或失败
    //24 如果then中第一个参数没传 或者是第二个没传的情况
    typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = result => result : null//25 没传的话 把上一个执行的结果给下一个
    typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {throw new ERROR(reason instanceof ERROR ? reason.message : reason ) } : null
    // 判断执行失败之后返回结果的的类型 

    return new Promise((resolve, reject) => {
      this.fulfilledAry.push(() => {
        try {
          let nextValue = fulfilledCallBack(this.value)
          //23 判断上一个then执行返回的是不是一个promise实例 
          nextValue instanceof Promise ? nextValue.then(resolve, reject) : resolve(nextValue)
        } catch (err) {
          reject(err)
        }
      })
      this.rejectedAry.push(() => {
        try {
          let nextValue = rejectedCallBack(this.value)
          nextValue instanceof Promise ? nextValue.then(resolve, reject) : reject(nextValue)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
  //26 catch 方法就是相当于then没传第一个参数
  catch(rejectedCallBack) {
    this.then(null, rejectedCallBack)
  }
  // promise.all([])  all方法是挂载原型上的属性 函数有三大角色 类 对象 普通函数  class声明类是 用static XX 挂载属性
  static all(promiseAry = []) {
    let index = 0
    let resultAry = []
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseAry.length; i++) {
        promiseAry[i]().then((result) => {
          index++
          resultAry[i] = result//因为all方法执行的时候 跟promise实例执行的结果是一致的  不能用push 
          if (index === promiseAry.length) {
            resolve(resultAry)
          }
        }, reject)

      }
    })
  }
  static race(promiseAry = []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseAry.length; i++) {
        promiseAry[i]().then((result) => {
          //因为rase方法执行的时候 只要成功就走resolve
          let value = result
          if (value) {
            resolve(value)
            break
          }
        }, reject)

      }
    })
  }
}