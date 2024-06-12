// Валидация (библиотека Validator.js)
function validate($input) {
    $input.each(function() {
        var $input = $(this);
        var $inputParent = $input.parent();
        var inputMask = $input.attr("data-mask");
        var isRequired = $input.hasClass("required");
        var errorText = "";
        var value = $input.val();
    
        if(inputMask === "phone" && !validateRuPhone(value)) {
            errorText = 'Некорректный номер';
        }

        if(inputMask === "email") {
            if(isRequired && !value){
                errorText = `Обязательно`;
            }

            if(value && !validator.isEmail(value)){
                errorText = 'Некорректный email';
            }
        }
    
        if(isRequired && validator.isEmpty(value)) {
            errorText = `Обязательно`;  
        }
    
        $inputParent.find(".input_error").remove();
        if(errorText) {
            // Вывод ошибки 
            $inputParent.addClass("error");
            $inputParent.append("<div class='input_error'>"+errorText+"</div>")
            
        } else {
            // Скрытие ошибки 
            $inputParent.removeClass("error");
        }
    });
}
// Валидация END

// Валидация форм
function validateForm($form) {
    validate($form.find("input,textarea"));

    return !$form.find(".error").length;
}
// Валидация форм END

// Очистка форм 
function clearForm($form) {
    $form.find("input,textarea").blur();
    $form.find(".error").removeClass("error");
    $form.find(".input_error").remove();
    $form.find('.icon-correct').hide()
    $form.find('.icon-hide').hide()
    $form.find("input:not([type=checkbox]):not([type=radio]):not([name=sessid]):not([type=hidden]), textarea").val("");
    $form.find('input[type=file]').trigger('change')
    $form.find('.focused__label').removeClass('focused__label')
}
// Очистка форм END

// Валидация поля при потере фокуса
$(document).on("blur", "input, textarea", function() {
    validate($(this));
});
// Валидация поля при потере фокуса END

// Фильтрация символов ввода email
$(document).on("input", "[data-mask=email]", function() {
    var newVal = formatEmailText($(this).val());
	$(this).val(newVal)
});
// Фильтрация символов ввода email END

// Фильтрация ввода только чисел
$(document).on("input", "[data-mask=number]", function() {
    var newVal = onlyNumbersString($(this).val());
	$(this).val(newVal)
});
// Фильтрация ввода только чисел END

// Фильтрация символов ввода имени
$(document).on("input", "[data-mask=name]", function() {
    var string = $(this).val();

    string = string
        .replace(/\s{2,}/g, ' ')
        .replace(/-{2,}/g, '-')
        .replace(/-\s/g, ' ')
        .replace(/\s-/g, ' ')
        .replace(/^-?/, '')
        .replace(/[^а-яёЁА-ЯA-Za-z\- ]/gim, '');
    string = capitalizeText(string);

	$(this).val(string)
});
// Фильтрация символов ввода имени END

// Форматирование email
function formatEmailText(email) {
    var string = email;
    string = cyrillicSymbolsToLatin(string);
    return string.trim();
};
// Форматирование email END

// Кириллица в латиницу
function cyrillicSymbolsToLatin(text) {
    var layout = {'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']', 'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': '\'', 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', 'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '[', 'Ъ': ']', 'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ';', 'Э': '\'', 'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': ',', 'Ю': '.', '"': '@', };
    var str = text;
    var r = '';
    for (var i = 0; i < str.length; i++) {
        r += layout[str.charAt(i)] || str.charAt(i)
    }
    return r
}
// Кириллица в латиницу END

// Латиница в кириллицу
function latinSymbolsToCyrillic(val) {
    var layout = {'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', '\'': 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', 'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З', 'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д', 'Z': 'Я', 'X': 'ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь', '.': 'ю', ',': 'б', '`': 'ё'};
    var str = val;
    var r = '';
    for (var i = 0; i < str.length; i++) {
        r += layout[str.charAt(i)] || str.charAt(i);
    }
    return r;
}
// Латиница в кириллицу END

// Преобраует первые буквы слов в заглавные
function capitalizeText(value) {
    var str = value;
    var text = '';
    var space = !0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] === ' ' || str[i] === '-') {
        space = !0;
        text += str[i];
      } else {
        if (space) {
          text += str[i].toUpperCase();
          space = !1;
        } else {
          text += str[i].toLowerCase();
          space = !1;
        }
      }
    }
    str = text;
    return str;
}
// Преобраует первые буквы слов в заглавные END

// Удаляет из строки все, кроме чисел
function onlyNumbersString(string) {
    return string.replace(/[^0-9]/gim, '');
}  
// Удаляет из строки все, кроме чисел END

// Валидация российского номер
function validateRuPhone(str) {
    return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
        str
    );
}
// Валидация российского номер END