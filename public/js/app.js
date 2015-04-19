function onTheButtonClick() {
  $.ajax(
    'http://toggl.io/users/1/tessel/toggle',
    function(result, status) {
      console.log(result);
    }
  );
}
