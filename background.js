console.log("background console starts");

let meta=null; // metadata

let getActiveTab=()=> {
    return browser.tabs.query({active: true, currentWindow: true});
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) =>{
    console.log("received content message.");
    if (msg.page != 'douban-1') {
        meta=JSON.parse(msg.meta);
        downloadConfig = {'url': meta['imgUrl']};
        switch (msg.page){
            case "ototoy":
            case "163":
            case "apple": 
                downloadConfig['filename'] = meta['album'].replace(/[/\:*?"<>]/,"")+'.jpg'
        }
        console.log("Metadata received in background");
        if (meta['imgUrl']){
            browser.downloads.download( downloadConfig
            ).then(
                (id)=>{console.log('Image downloaded');}, 
                (error)=>{console.log("Image download failed");}
            );
        }
    } else {
        if (meta){
            console.log("Douban-1 message received and meta is stored in background.")
            getActiveTab().then((tabs) =>{
                browser.tabs.sendMessage(tabs[0].id, {'meta':JSON.stringify(meta)});
                meta=null;
            });
        }
    }
});

console.log("background console ends");