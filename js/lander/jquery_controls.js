$(function () {
    init();
    var form = $('ul.form');
    $('nav').hide();
    $('ul li:nth-child(2) a').on('click', function () {
      $('nav').hide(); scene.start(); lander.myTimer.reset();
      $('#nextLevel em').text(level += 1);
    });

    $('ul li:nth-child(1) a').on('click', function () {
      restart();
    });
   
    $('ul.form li a').click(
      function (e) {
	e.preventDefault(); // prevent the default action
	e.stopPropagation(); // stop the click from bubbling
	$(this).closest('ul').find('.selected').removeClass('selected');
	$(this).parent().addClass('selected');
    });
    
    form.hide();
    
$('.top').on('touchstart', function(e) {
    e.stopPropagation();
            fuel -= 5;
                lander.addVector(0, 1);
                lander.blinkOrNot(lander.imgUp);
                lander.falling = true;
});
$('.left').on('touchstart', function(e) {
    e.stopPropagation();
            fuel -= 1;
                lander.addVector(90, 0.1);
                lander.blinkOrNot(lander.imgLeft);
});$('.right').on('touchstart', function(e) {
    e.stopPropagation();
            fuel -= 1;
                lander.addVector(270, 0.1);
                lander.blinkOrNot(lander.imgRight);
});

});
