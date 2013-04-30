$(window).load(function() {
    "use strict";

    var video = document.getElementById('webcam'),
        canvas = document.getElementById('canvas');
    try {
        compatibility.getUserMedia({video: true}, function(stream) {
            try {
                video.src = compatibility.URL.createObjectURL(stream);
            } catch (error) {
                video.src = stream;
            }
            setTimeout(function() {
                video.play();
                pulse_app();
                compatibility.requestAnimationFrame(tick);
            }, 500);
        }, function (error) {
            $('#canvas').hide();
            $('#log').hide();
            $('#no_rtc').html('<h4>WebRTC not available.</h4>');
            $('#no_rtc').show();
        });
    } catch (error) {
        $('#canvas').hide();
        $('#log').hide();
        $('#no_rtc').html('<h4>Something goes wrong...</h4>');
        $('#no_rtc').show();
    }


    var ctx, canvasWidth, canvasHeight,
        red = [], green = [];

    var num_frames = 512;

    var frame = 0;

    function pulse_app() {
        canvasWidth  = canvas.width;
        canvasHeight = canvas.height;
        ctx = canvas.getContext('2d');
    }

    function tick() {
        if (frame < num_frames) {
            compatibility.requestAnimationFrame(tick);
            if (video.readyState === video.HAVE_ENOUGH_DATA) {

                ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
                var data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;

                var redsum = 0, greensum = 0;
                for (var index = 0; index < canvasHeight * canvasWidth * 4; index+=4) {
                    redsum += data[index];
                    greensum += data[index+1];
                }
                red[frame] = redsum;
                green[frame] = greensum;

                ++frame;
            }
        } else if (frame === num_frames) {
            findPulse(); 
        }
    }

    function findPulse() {

        var signal = utils.PCA([r, g])[2];

        var spectrum = utils.fft(signal);

        var pulse=0, max=0;
        for (i=0; i<num_frames;i++) {
            var frequency=(60.0/num_frames)*(i+1.5);
            if (frequency>0.5 && frequency<3) {
                if (spectrum[i]>max) {
                    max=spectrum[i];
                    pulse=Math.round(frequency*60);
                }
            }
        }

        $('#pulse').html(pulse);
        $('#result').show();
    }


    $(window).unload(function() {
        video.pause();
        video.src=null;
    });
});