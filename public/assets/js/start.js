document.querySelector('#join').addEventListener('click', function () {
  document.querySelector('.curve').classList.add('curveAnim');
  document.querySelector('header.intro').classList.add('headerFade');
  document.querySelector('section.start').classList.add('pageFade');
  document.querySelector('header.intro h1').classList.add('pageFade');

  setTimeout(function() {
    let room = document.querySelector('#room').value.toLowerCase();
    room = room.replace(' ', '_');
    location.href = `/r/${encodeURI(room)}`;
  }, 700);
});