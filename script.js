let video = document.querySelector('video');
let recordBtnCont = document.querySelector('.record-btn-cont');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtn = document.querySelector('.capture-btn');

let recordFlag = false;

let recorder;

let chunks = []; //media data in chunks

let transparentColor = "transparent";

console.log(video.srcObject);

let constraints = {
    video: true,
    audio: true
};
//navigator -> global browser info
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data)
    })
    recorder.addEventListener("stop", (e) => {
        //conversion chunks data to video

        let blob = new Blob(chunks, {
            type: "video/mp4"
        });

        if (db) {
            let videoid = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoid}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }

        /* let videoURL = URL.createObjectURL(blob);
         let a = document.createElement("a");
         a.href = videoURL;
         a.download = "stream.mp4";
         a.click();*/

    })


});

recordBtnCont.addEventListener("click", (e) => {

    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) { //start

        recorder.start();
        startTimer();
        recordBtn.classList.add('scale-record');

    } else { //stop
        recorder.stop();
        stopTimer()
        recordBtn.classList.remove('scale-record');
    }



});


captureBtn.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight

    let tool = canvas.getContext("2d");

    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = transparentColor;

    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    /* let imageURL = canvas.toDataURL();

     let a = document.createElement("a");
     a.href = imageURL;
     a.download = "image.jpeg";
     a.click();*/

    if (db) {
        let imageid = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageid}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 1000);



})






//timer-cont
//timer

let timer = document.querySelector('.timer');

let timerID


let counter = 0; //represents seconds

function startTimer() {

    function displayTimer() {

        timer.style.display = 'block'

        let hours = Number.parseInt(counter / 3600);
        let temp = counter % 3600;
        let min = Number.parseInt(temp / 60);
        let temp2 = temp % 60;
        let sec = temp2;

        hours = hours < 10 ? `0${hours}` : hours;
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;

        timer.innerText = `${hours}:${min}:${sec}`;



        counter++;

    }

    timerID = setInterval(displayTimer, 1000);



}

function stopTimer() {

    clearInterval(timerID);
    timer.style.display = 'none'
    timer.innerText = "00:00:00";
    counter = 0;


}





//scale-record

//scale-capture

//record-btn-cont

//capture-btn-cont

let filterLayer = document.querySelector('.filter-layer');

let allFilters = document.querySelectorAll('.filter');

allFilters.forEach((filterElem) => {


    filterElem.addEventListener("click", (e) => {


        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
});