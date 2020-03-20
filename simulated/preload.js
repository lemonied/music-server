Object.defineProperty(navigator, 'webdriver',{
  get: function () {
    return undefined;
  }
});
Object.defineProperty(navigator, 'languages', {
  get: function () {
    return ['en-US', 'en'];
  }
});
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return [1, 2, 3, 4, 5,6];
  }
});
window.navigator.chrome = {
  runtime: {}
};
window.addEventListener('load', function() {
  var switcher = document.getElementById('switcher_plogin');
  if (switcher) {
    switcher.click();
    var username = document.getElementById('u');
    var password = document.getElementById('p');
    if (username && password) {
      username.value = '$username$';
      password.value = '$password$';
      setInterval(function () {
        document.getElementById('login_button').click();
      }, 200);
    }
  }
  var slider = document.getElementById('tcaptcha_drag_button');
  if (slider) {
    console.log('slide');
  }
});
