console.log('XXX homepage-slider parsed')
  $(document).ready(function() {
console.log('XXX homepage-slider ready')

    var conf = {
      fadeTime: 800,
      rollTime: 6000
    };

    var rollImageInit = function(imgroll) {
      imgroll.children().each(function(idx, item) {
console.log('XXX homepage-slider init')
        if (idx == 0) {
          $(item).show();
        } else {
          $(item).hide();
        }
      });
    };

    var rollImageNext = function(imgroll) {
      var imgidx = imgroll.data('rollimg-idx') || 0,
        imgcount = imgroll.children().length,
        nextidx = (imgidx + 1) % imgcount,
        oldimg = $(imgroll.children()[imgidx]);

      imgroll.children().each(function(idx, item) {
        if (idx == imgidx) {
          $(item).show().css('z-index', '2');
        } else if (idx == nextidx) {
          $(item).show().css('z-index', '1');
        } else {
          $(item).hide();
        }
      });

      // To allow attaching extra handlers
      $(imgroll).trigger('roll-start', {
        target: $(imgroll.children()[nextidx]),
        conf: conf
      });

      oldimg.fadeOut(conf.fadeTime);
      imgroll.data('rollimg-idx', nextidx);
    };

    $('.homepage-slider-ng .images-wrapper').each(function() {
      var imgroll = $(this);
      rollImageInit(imgroll);
      setInterval(function() {
        rollImageNext(imgroll);
      }, conf.rollTime);
    });

  });
