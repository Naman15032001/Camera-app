setTimeout(() => {

    if (db) {
        //videos retrieval
        //images retrieval

        let dbTransactionr = db.transaction("video", "readonly");

        let videoStore = dbTransactionr.objectStore("video");

        let videoRequest = videoStore.getAll(); //event driven

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let gallery = document.querySelector('.gallery-cont');

            console.log(videoResult);

            videoResult.forEach((videoObj) => {

                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-cont");

                mediaElement.setAttribute("id", videoObj.id);

                let videoURL = URL.createObjectURL(videoObj.blobData);

                mediaElement.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${videoURL}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>`;

                gallery.appendChild(mediaElement);

                let deleteBtn = mediaElement.querySelector('.delete');
                let downloadBtn = mediaElement.querySelector('.download');

                deleteBtn.addEventListener('click', deleteListener);
                downloadBtn.addEventListener("click", downloadListener);

            });


        }



        let dbTransactioni = db.transaction("image", "readonly");

        let imageStore = dbTransactioni.objectStore("image");

        let imageRequest = imageStore.getAll(); //event driven

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let gallery = document.querySelector('.gallery-cont');

            console.log(imageResult);

            imageResult.forEach((imageObj) => {

                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-cont");

                mediaElement.setAttribute("id", imageObj.id);

                mediaElement.innerHTML = `
                <div class="media">
                    <img src="${imageObj.url}"/>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>`;

                gallery.appendChild(mediaElement);

                let deleteBtn = mediaElement.querySelector('.delete');
                let downloadBtn = mediaElement.querySelector('.download');

                deleteBtn.addEventListener("click", deleteListener);
                downloadBtn.addEventListener("click", downloadListener);

            });


        }


    }
}, 100);

//ui remove db remove

function deleteListener(e) {


    console.log(e.target.parentElement);
    let id = e.target.parentElement.getAttribute("id");

    if (id.slice(0, 3) === 'vid') {

        let dbTransactionv = db.transaction("video", "readwrite");

        let videoStore = dbTransactionv.objectStore("video");

        videoStore.delete(id);

    } else if (id.slice(0, 3) === 'img') {

        let dbTransactioni = db.transaction("image", "readwrite");

        let imageStore = dbTransactioni.objectStore("image");

        imageStore.delete(id);

    }

    //ui

    e.target.parentElement.remove()
}

function downloadListener(e) {

    console.log(e.target.parentElement);
    let id = e.target.parentElement.getAttribute("id");

    if (id.slice(0, 3) === 'vid') {

        let dbTransactionv = db.transaction("video", "readwrite");

        let videoStore = dbTransactionv.objectStore("video");

        let videoRequest = videoStore.get(id);

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData)

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }

    } else if (id.slice(0, 3) === 'img') {

        let dbTransactioni = db.transaction("image", "readwrite");

        let imageStore = dbTransactioni.objectStore("image");

        let imageRequest = imageStore.get(id);

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpeg";
            a.click();
        }




    }


}