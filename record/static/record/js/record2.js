const runner = document.getElementById('runner');
const player = document.getElementById('player');
let running = false;

const recordAudio = () => {
    return new Promise(resolve => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const options = { mimeType: 'audio/webm' };
                const mediaRecorder = new MediaRecorder(stream, options);
                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                });

                const start = () => {
                    mediaRecorder.start();
                };

                const stop = () => {
                    return new Promise(resolve => {
                        mediaRecorder.addEventListener("stop", () => {
                            const audioBlob = new Blob(audioChunks);
                            const audioUrl = URL.createObjectURL(audioBlob);
                            const audio = new Audio(audioUrl);
                            const play = () => {
                                audio.play();
                            };

                            resolve({ audioBlob, audioUrl, play });
                        });

                        mediaRecorder.stop();
                    });
                };

                resolve({ start, stop });
            });
    });
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function startRecording() {
    (async () => {
        const recorder = await recordAudio();
        recorder.start();

        setInterval(async () => {
            if (!running) {
                const audio = await recorder.stop();
                // audio.play();
                player.src = audio.audioUrl;
                console.log(audio.audioBlob);
                sendBlobData('127.0.0.1:8000/record/upload/', audio.audioBlob);
                console.log(audio.audioUrl);
            }
        }, 25);
    })()
}

function sendBlobData(url, blobData) {
    var csrftoken = getCookie('csrftoken');
    let xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    let data = {
        status:"some status code",
        blob: blobData
    }
    xmlhttp.open("POST", url);
    //xmlhttp.onerror(alert(error(xhr.status)));
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.setRequestHeader("X-CSRFToken", csrftoken);
    xmlhttp.send(JSON.stringify(data));
    xmlhttp.upload.onloadend = function() {
        alert('Upload complete');}
   
}   


runner.addEventListener('click', function () {
    running = !running;
    if (running) {
        runner.value = "stop"
        startRecording()
    } else {
        runner.value = "start"
    }
})
