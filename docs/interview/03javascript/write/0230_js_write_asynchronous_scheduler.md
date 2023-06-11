# JS 实现并发可控的异步调度器

## 题干

在 JS 中，异步编程是一种常见的编程方式，它可以让程序在等待某些操作（如网络请求、文件读写、定时器等）的结果时，不阻塞主线程，而继续执行其他代码。这样可以提高程序的性能和用户体验。 但是，如果有多个异步操作同时进行，就需要考虑它们之间的协调和管理问题。

### 异步问题

- 如何避免过多的异步操作占用系统资源，导致内存溢出或者网络拥堵？ 
- 如何保证异步操作的执行顺序或者优先级？ 
- 如何处理异步操作的成功或者失败结果？ 


### 异步并发任务调度器

为了解决这些问题，我们可以使用一种 **异步并发任务调度器**。它可以让我们将一系列返回 `Promise` 对象的函数（也就是异步任务）添加到一个队列中，并根据设定的最大并发数（也就是同时进行的异步任务数量），按照先进先出（`FIFO`）的原则，依次执行队列中的任务，并处理它们返回的 `Promise` 对象。

这样做有以下几个好处： 

- 可以限制同时进行的异步任务数量，避免资源浪费或者竞争。 
- 可以保证队列中先添加的任务先执行，后添加的任务后执行。 
- 可以统一处理所有任务返回的 `Promise` 对象，并根据成功或者失败做相应操作。

### 应用场景

- 对多个网络请求进行批量处理时，例如下载多张图片、上传多个文件、获取多条数据等。
- 对多个文件进行批量操作时，例如读取多个文件内容、写入多个文件数据、删除多个文件等。
- 对多个定时器进行批量管理时，例如设置多个倒计时、取消多个倒计时等。

请编写一个异步并发任务调度器，它可以控制并发数量，还可以根据需要调整并发数量的大小。


## 题解

### No.手动执行版

`push` 入队，`shift` 出队，递归调用。

```js
function scheduler(maxCount) {
  // 运行中任务数
  let runningCount = 0;
  // 任务队列
  let taskQueue = [];

  // 添加任务到任务队列
  function add(promiseCreator) {
    taskQueue.push(promiseCreator);
  }

  // 任务开始执行
  function start() {
    for (let i = 0; i < maxCount; i++) next();
  }

  // 任务递归执行
  function next() {
    if (!taskQueue || !taskQueue.length || runningCount >= maxCount) return;
    runningCount++;
    taskQueue.shift()().then(() => {
      // 出队则递归调用新任务
      runningCount--;
      next();
    });
  }

  return { add, start };
}


// 定义一个异步方法
const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 创建一个调度器，最大并发数为2
const myScheduler = scheduler(2);

// 添加任务到调度器中
const addTask = (time, order) => {
  myScheduler.add(() => timeout(time).then(() => console.log(order)));
};

// 使用
addTask(1000, "1");
addTask(1000, "2");
addTask(1000, "3");
addTask(1000, "4");

// 启动
myScheduler.start();
```

上面的调度器，是一种简单写法，使用场景受限。

当添加异步任务后，需要手动调用执行方法 `start`，队列执行完毕后，再次添加任务至队列，需要重新调用 `start` 方法执行，其实很多时候，我们不需要手动调用执行，仅仅只是想控制并发而已。

### No.自动执行版

```js
const scheduler = (maxCount) => {
  // 运行中任务数
  let runningCount = 0;
  // 任务队列
  let taskQueue = [];

  // 添加任务到任务队列
  const add = (promiseCreator) => {
    return new Promise((resolve) => {
      taskQueue.push(() => {
        runningCount++;
        // 执行任务
        promiseCreator().then(resolve).finally(() => {
          runningCount--;
          // 如果任务队列不为空，继续执行下一个任务
          if (taskQueue.length > 0) {
            taskQueue.shift()();
          }
        });
      });
      // 如果当前运行的任务数小于最大并发数，直接执行下一个任务
      if (runningCount < maxCount) {
        taskQueue.shift()();
      }
    });
  };

  return { add };
};

// 定义一个异步方法
const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 创建一个调度器，最大并发数为2
const s = scheduler(2);

// 添加任务到调度器中
const addTask = (time, order) => {
  s.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, "1");
addTask(1000, "2");
addTask(1000, "3");
addTask(1000, "4");
```

## 扩展

这个调度器的性能可以通过以下方式进行优化：

- 使用更高效的数据结构，例如链表或堆，以便在添加和删除任务时获得更好的性能。
- 使用更高效的算法来选择下一个任务，例如使用优先级队列而不是简单的队列。
- 使用更高效的异步模式，例如使用 `async/await` 而不是 `Promise`。
- 使用更高效的并发模式，例如使用 `Web Workers` 或 `SharedArrayBuffer`。

注意，这些优化可能会增加代码的复杂性，且可能会使代码更难以理解和维护。因此，在进行优化之前，请确保您已经确定了性能瓶颈，并且您确实需要进行优化。