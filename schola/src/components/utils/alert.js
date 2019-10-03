// The main class
var AlertBox = function(id, option) {
    this.show = function(msg) {
      if (msg === ''  || typeof msg === 'undefined' || msg === null) {
        throw '"msg parameter is empty"';
      }
      else {
        var alertArea = document.querySelector(id);
        var alertBox = document.createElement('DIV');
        var alertContent = document.createElement('DIV');
        var alertClose = document.createElement('A');
        var alertClass = this;
        alertContent.classList.add('alert-content');
        alertContent.innerText = msg;
        alertClose.classList.add('alert-close');
        alertClose.setAttribute('href', '#');
        alertBox.classList.add('alert-box');
        alertBox.appendChild(alertContent);
        if (!option.hideCloseButton || typeof option.hideCloseButton === 'undefined') {
          alertBox.appendChild(alertClose);
        }
        alertArea.appendChild(alertBox);
        alertClose.addEventListener('click', function(event) {
          event.preventDefault();
          alertClass.hide(alertBox);
        });
        if (!option.persistent) {
          var alertTimeout = setTimeout(function() {
            alertClass.hide(alertBox);
            clearTimeout(alertTimeout);
          }, option.closeTime);
        }
      }
    };
  
    this.hide = function(alertBox) {
      alertBox.classList.add('hide');
      console.log(alertBox);
      var disperseTimeout = setTimeout(function() {
          if (alertBox.parentNode) {
            alertBox.parentNode.removeChild(alertBox);
          }
        clearTimeout(disperseTimeout);
      }, 500);
    };
  };
  
  // Sample invoke
//   var alertNonPersistent = document.querySelector('#alertNonPersistent');
//   var alertPersistent = document.querySelector('#alertPersistent');
//   var alertShowMessage = document.querySelector('#alertShowMessage');
//   var alertHiddenClose = document.querySelector('#alertHiddenClose');
//   var alertMessageBox = document.querySelector('#alertMessageBox');
  export var alertbox = new AlertBox('#alert-area', { ///////////////////////////////aqui
    closeTime: 5000,
    persistent: false,
    hideCloseButton: false
  });
//   var alertboxPersistent = new AlertBox('#alert-area', {
//     closeTime: 5000,
//     persistent: true,
//     hideCloseButton: false
//   });
//   var alertNoClose = new AlertBox('#alert-area', {
//     closeTime: 5000,
//     persistent: false,
//     hideCloseButton: true
//   });