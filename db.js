let db;

let openRequest = indexedDB.open("myDatabase");

//open db
//crewate object store
//do transactions

openRequest.addEventListener("success", (e) => {
    console.log("db success");
    db = openRequest.result;

});

openRequest.addEventListener("error", (e) => {
    console.log("db error");
})

openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("db upgraded and also for initial db creation");
    db = openRequest.result;


    db.createObjectStore("video", {
        keyPath: "id"
    });
    db.createObjectStore("image", {
        keyPath: "id"
    });

});

