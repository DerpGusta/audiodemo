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
                        upload(audio.audioBlob);
                    });
                };

                resolve({ start, stop });
            });
    });
};

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
                console.log(audio.audioUrl);
            }
        }, 25);
    })()
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

// Required for Django CSRF


// Actual Upload function using xhr
function upload(){

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '127.0.0.1:8000/record/upload/', true);
    

    };
    // If you want you can show the upload progress using a progress bar
    //var progressBar = document.querySelector('progress');
    // xhr.upload.onprogress = function(e) {
    //     if (e.lengthComputable) {
    //         progressBar.value = (e.loaded / e.total) * 100;
    //         progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
    //     }
    // };

    xhr.send(blob);}