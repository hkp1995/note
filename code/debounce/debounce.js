const username = document.querySelector('#username');
const tip = document.querySelector('.tip');
const count = document.querySelector('.count');
const btn = document.querySelector('.btn');
let check;

username.addEventListener('input', (check = debounce(checkUsername, 1000)));

btn.addEventListener('click', () => {
  check.cancel();
});

function checkUsername() {
  count.innerHTML = +count.innerHTML + 1;
  if (!/^[a-zA-Z0-9_]{6,14}$/.test(username.value)) {
    tip.style.visibility = 'visible';
  } else {
    tip.style.visibility = 'hidden';
  }
}

function debounce(func, wait, immediate = false) {
  let timer = null;
  let result;

  let debounced = function() {
    const _this = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      // 初始化 timer = null，于是立即执行 func
      if (!timer) {
        // 如果有 func 返回值的话，返回结果
        result = func.apply(_this, args);
      }
      // 开启一个 setTimeout，在 wait 时间内，timer !== null, 于是 !timer = false，就不会再执行 func 了。
      timer = setTimeout(() => {
        timer = null;
      }, wait);
    } else {
      // 由于 setTimeout 包裹了 func.apply(_this, args)，所以获取不到返回值。
      timer = setTimeout(() => {
        func.apply(_this, args);
      }, wait);
    }

    return result;
  };

  debounced.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
