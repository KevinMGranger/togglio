function onTheButtonClick() {
  $.post(
    'http://toggl.io/users/1/tessel/toggle',
    function(result, status) {
      console.log(result);
    }
  );
}
