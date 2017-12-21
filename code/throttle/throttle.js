const oldStr = document.querySelector('.oldStr');
const newStr = document.querySelector('.newStr');
const count = document.querySelector('.count');

// 1.首部执行
// oldStr.addEventListener('input', throttle(toUpper, 500, { leading: true, trailing: false }));
// 2.首部执行（默认）
// oldStr.addEventListener('input', throttle(toUpper, 500));
// 3.首尾部都执行
oldStr.addEventListener('input', throttle(toUpper, 500, { leading: true }));
// oldStr.addEventListener('input', throttle(toUpper, 500, { leading: true, trailing: true }));

function toUpper() {
  count.innerHTML = +count.innerHTML + 1;
  newStr.innerHTML = oldStr.value.toUpperCase();
}

function throttle(func, wait, { leading = false, trailing = true } = {}) {
  let startTime = 0;
  let timer = null;

  let throttled = function() {
    const _this = this;
    const args = arguments;
    let curTime = new Date();

    // 如果是第一次执行，并且不需要首部执行
    if (!startTime && !leading) startTime = curTime;

    const remaining = wait - (curTime - startTime); // 剩余时间

    if (remaining <= 0) { // 首部执行
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(_this, args);
      startTime = curTime;
    } else if (!timer && trailing) { // 尾部执行
      timer = setTimeout(() => {
        startTime = new Date();
        timer = null;
        func.apply(_this, args);
      }, remaining);
    }
  };

  throttled.cancel = function() {
    clearTimeout(timer);
    timer = null;
    startTime = 0;
  };

  return throttled;
}
