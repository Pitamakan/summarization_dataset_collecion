exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
  }, {
    getTemplateData: function() {
      let data = TolokaHandlebarsTask.prototype.getTemplateData.apply(this, arguments);
      const lengthInput = (data.input) ? Object.keys(data.input).length : 0;
  
      data.content = [];
  
      for (let i = 0; i < lengthInput; i++) {
        if (data.input[`action${i}`]) {
          let obj = {};
          obj.action = data.input[`action${i}`];
  
          if (data.input[`state${i}`]) {
             obj.state = data.input[`state${i}`];
          }
  
          data.content.push(obj);
        }
      }
  
      data.content.reverse();
  
      return data;
    },
    onRender: function() {
  
    },
    onDestroy: function() {
      // Задание завершено, можно освобождать (если были использованы) глобальные ресурсы
    }
  });
  
  
  exports.TaskSuite = extend(TolokaHandlebarsTaskSuite, function (options) {
    TolokaHandlebarsTaskSuite.call(this, options);
  }, {
    onRender: function() {
      const root = this.getDOMElement();
      const tasks = root.querySelectorAll('.task');
      const _this = this;
      window.curTask = 0;
  
      root.style.left = '0';
  
      for (let i = 0; i < tasks.length; i++) {
        let tabListHTML = ''
  
        for (let j = 0; j < tasks.length; j++) {
          if (i === j) {
            tabListHTML += ' <div class="tabListItem selected" data-number="' + (j) + '">' +
                              '<div class="tabListItemName">' + (j + 1) + ' Задание' +'</div>' +
                            '</div>';
          } else {
            tabListHTML += ' <div class="tabListItem" data-number="' + (j) + '">' +
                              '<div class="tabListItemName">' + (j + 1) + ' Задание' +'</div>' +
                            '</div>';       
          }
        }
  
        tasks[i].querySelector('.tabList').innerHTML = tabListHTML;
  
        tasks[i].querySelectorAll('.curTab').forEach(item => {
          item.innerHTML = i + 1;
        });
  
        tasks[i].querySelectorAll('.tabsCount').forEach(item => {
          item.innerHTML = tasks.length;
        });
  
        tasks[i].querySelectorAll('.leftScroll').forEach(item => {
          item.i = i;
        });
  
        tasks[i].querySelectorAll('.rightScroll').forEach(item => {
          item.i = i;
        });
  
        tasks[i].dataset.number = i.toString();
  
        //Переключение между тасками
        tasks[i].querySelectorAll('.leftScroll').forEach(left => left.addEventListener('click', function (e) {
          if (this.i > 0 && !window.scrollingNow) {
            e.stopPropagation();
            window.curTask = i - 1;
            window.scrollingNow = true;
  
            root.style.left = parseInt(root.style.left) + 100 + 'vw';
            _this.focusPreviousTask(true);
            setTimeout(function () {
              window.scrollingNow = false;
            }, 300);
          }
        }));
  
        tasks[i].querySelectorAll('.rightScroll').forEach(right => right.addEventListener('click', function (e) {
          if (this.i < tasks.length - 1 && !window.scrollingNow) {
            e.stopPropagation();
            window.curTask = i + 1;
            window.scrollingNow = true;
  
            root.style.left = parseInt(root.style.left) - 100 + 'vw';
            _this.focusNextTask(true);
            setTimeout(function () {
              window.scrollingNow = false;
            }, 300);
          }
        }));
  
        tasks[i].querySelectorAll('.tabListItem').forEach(tabListItem => tabListItem.addEventListener('click', function (e) {
          if (!window.scrollingNow) {
            e.stopPropagation();
            const number = parseInt(tabListItem.dataset.number);
            window.curTask = number;
            window.scrollingNow = true;
  
            root.style.left = (- 100 * number + 'vw');
            _this.focusTask(number);
            setTimeout(function () {
              window.scrollingNow = false;
            }, 300);
          }
        }));
      }
    },
    focusPreviousTask: function(arrowClick) {
      TolokaTaskSuite.prototype.focusPreviousTask.call(this);
      if (arrowClick || window.curTask === 0) {
        return;
      }
  
      const root = this.getDOMElement();
      window.curTask = window.curTask - 1;
      window.scrollingNow = true;
  
      root.style.left = parseInt(root.style.left) + 100 + 'vw';
      setTimeout(function () {
        window.scrollingNow = false;
      }, 300);
    },
    focusNextTask: function(arrowClick) {
      TolokaTaskSuite.prototype.focusNextTask.call(this);
      const root = this.getDOMElement();
      const tasks = root.querySelectorAll('.task');
  
      if (arrowClick || window.curTask === tasks.length - 1) {
        return;
      }
  
      window.curTask = window.curTask + 1;
      window.scrollingNow = true;
  
      root.style.left = parseInt(root.style.left) - 100 + 'vw';
      setTimeout(function () {
        window.scrollingNow = false;
      }, 300);
    },
    onValidationFail: function (errors) {
      TolokaTaskSuite.prototype.onValidationFail.call(this, errors);
      const root = this.getDOMElement();
  
      if (errors && errors.length > 0) {
        let firstError;
  
        for (let i = 0; i < errors.length; i++) {
          if (errors[i]) {
            firstError = errors[i];
            break;
          }
        }
  
        if (firstError) {
          const taskId = parseInt(firstError.task_id, 10);
  
          if (taskId !== window.curTask) {
            root.style.left = parseInt(root.style.left) + 100 * (window.curTask - taskId) + 'vw';
            window.scrollingNow = true;
            window.curTask = taskId;
            setTimeout(function () {
              window.scrollingNow = false;
            }, 300);
          }
        }
      }
    }
  });
  
  function extend(ParentClass, constructorFunction, prototypeHash) {
    constructorFunction = constructorFunction || function () {};
    prototypeHash = prototypeHash || {};
    if (ParentClass) {
      constructorFunction.prototype = Object.create(ParentClass.prototype);
    }
    for (var i in prototypeHash) {
      constructorFunction.prototype[i] = prototypeHash[i];
    }
    return constructorFunction;
  }
  
  Handlebars.registerHelper("wrapLinks", function(text) {
    return text.replace(/(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi, '<span class="link"><a href="$&" target="_blank"><i class="material-icons">open_in_new</i>$&</a></span>')
  });
  
  Handlebars.registerHelper('split', function(context, d, d2) {
    if (typeof context == 'object') {
      return context.map(function(elem) {
        return ' '+elem;
      });
    } else {
      return context;
    }
  });