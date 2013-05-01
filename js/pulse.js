function start() {

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
        red = [], green = [], blue = [];

    var num_frames = 512;

    var frame = 0;

    function pulse_app() {
        canvasWidth  = canvas.width;
        canvasHeight = canvas.height;
        ctx = canvas.getContext('2d');
    }

    function tick() {
        if (frame < 30) {
            compatibility.requestAnimationFrame(tick);
            ++frame
        } else if (frame < num_frames + 30) {
            var f = frame - 30;
            compatibility.requestAnimationFrame(tick);
            if (video.readyState === video.HAVE_ENOUGH_DATA) {

                ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
                var data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;

                var redsum = 0, greensum = 0, bluesum = 0, canvasSize = canvasHeight * canvasWidth * 4;
                for (var index = 0; index < canvasSize; index+=4) {
                    redsum += data[index];
                    greensum += data[index+1];
                    bluesum += data[index+2];
                }
                red[f] = redsum;
                green[f] = greensum;
                blue[f] = bluesum;

                ++frame;
            }
        } else if (frame === num_frames+30) {
            video.pause();
            video.src=null;
            findPulse(); 
        }
    }

    function findPulse() {

        var signals = utils.PCA([red, green]);
        var spectrum = utils.spectrum(signals[1]);

        var pulse=0, max=0, i;

        for (i=0; i<num_frames;i++) {
            var frequency=(60.0/num_frames)*(i+0.5);
            if (frequency>0.5 && frequency<3) {
                if (spectrum[i]>max) {
                    max=spectrum[i];
                    pulse=Math.round(frequency*60);
                }
            }
        }

        $('#pulse').html(pulse);
        $('#result').show();


        $.plot("#chart1", [red, green, blue].map(utils.addIndex) );

        $.plot("#chart2", signals.map(utils.addIndex) );

        $.plot("#chart3", [utils.addIndex(spectrum.slice(3,100))] );



    }


    
}