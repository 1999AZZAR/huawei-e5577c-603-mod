class MaterialFileInput {
  constructor() {
    document.addEventListener('change', function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches('.file_input_file')) {
                _changeInputText.call(t, event);
                _changeState.call(t, event);
            }
            t = t.parentNode;
        }
    });

    function _changeInputText() {
      var fileInputDiv = _findParentBySelector(this, '.file_input_div');
      var fileInput = fileInputDiv.querySelector('.file_input_file');
      var fileInputText = fileInputDiv.querySelector('.file_input_text');
      var str = fileInput.value;
      var i;
      if (str.lastIndexOf('\\')) {
        i = str.lastIndexOf('\\') + 1;
      } else if (str.lastIndexOf('/')) {
        i = str.lastIndexOf('/') + 1;
      }
      fileInputText.value = str.slice(i, str.length);
    }

    function _changeState() {
      var fileInputDiv = _findParentBySelector(this, '.file_input_div');
      var fileInputTextDiv = fileInputDiv.querySelector('.file_input_text_div');
      var fileInputText = fileInputDiv.querySelector('.file_input_text');
      if (fileInputText.value.length != 0) {
        if (!fileInputTextDiv.classList.contains("is-focused")) {
          fileInputTextDiv.classList.add('is-focused');
        }
      } else {
        if (fileInputTextDiv.classList.contains("is-focused")) {
          fileInputTextDiv.classList.remove('is-focused');
        }
      }
    }

    function _findParentBySelector(elm, selector) {
      var all = document.querySelectorAll(selector);
      var cur = elm.parentNode;
      while(cur && !_collectionHas(all, cur)) {
          cur = cur.parentNode;
      }
      return cur;
    }

    function _collectionHas(a, b) {
      for(var i = 0, len = a.length; i < len; i ++) {
          if(a[i] == b) return true;
      }
      return false;
    }
  }
}

new MaterialFileInput();