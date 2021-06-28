exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
  }, {
    validate: function(solution) {
      if (!solution.output_values.summary || solution.output_values.summary.length < 30) {
        return {
          task_id: this.getTask().id,
          errors: {
            'summary': {
              code: 'TO_SHORT',
              message: 'Слишком короткий пересказ'
            }
          }
        }
      } else if (solution.output_values.summary.length > 330) {
        return {
          task_id: this.getTask().id,
          errors: {
            'summary': {
              code: 'TO_LONG',
              message: 'Слишком длинный пересказ'
            }
          }
        }
      } else {
        return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
      }
    },
    onRender: function() {
      // DOM-элемент задания сформирован (доступен через #getDOMElement()) 
    },
    onDestroy: function() {
      // Задание завершено, можно освобождать (если были использованы) глобальные ресурсы
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
  