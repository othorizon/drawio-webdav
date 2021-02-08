// https://github.com/jgraph/drawio-webdav
function setNewFileName(input) {
    var newFileName = input.value;
    var newButton = document.getElementById("newFileNameButton");
    console.log('newFileName' + newFileName);

    var ex = '.drawio';
    //endwith ex
    if (newFileName.substring(newFileName.length - ex.length) == ex) {
        newButton.href = '/?filename=' + newFileName;

    }else{
        alert('文件名必须以'+ex+'结尾');
    }

};
function editDiagram(image) {
    var initial = image.getAttribute('src');
    image.setAttribute('src', 'http://www.draw.io/images/ajax-loader.gif');
    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');

    var close = function () {
        image.setAttribute('src', initial);
        document.body.removeChild(iframe);
        window.removeEventListener('message', receive);
    };

    var receive = function (evt) {
        if (evt.data.length > 0) {
            var msg = JSON.parse(evt.data);

            if (msg.event === 'init') {
                iframe.contentWindow.postMessage(JSON.stringify({
                    action: 'load',
                    xmlpng: initial
                }), '*');
            }
            else if (msg.event === 'export') {
                close();
                image.setAttribute('src', msg.data);
                save(location.href);
            }
            else if (msg.event === 'save') {
                iframe.contentWindow.postMessage(JSON.stringify({
                    action: 'export',
                    format: 'xmlpng', spin: 'Updating page'
                }), '*');
            }
            else if (msg.event === 'exit') {
                close();
            }
        }
    };

    window.addEventListener('message', receive);
    // iframe.setAttribute('src', 'https://www.draw.io/?embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json');
    iframe.setAttribute('src', 'http://localhost:8090/?offline=1&https=0&embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json');
    document.body.appendChild(iframe);
}

function save(url) {
    if (url != null) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
        var req = new XMLHttpRequest();
        req.withCredentials = true;
        var wnd = (url !== window.location.href) ? window.open() : null;

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status !== 200 && req.status !== 201) {
                    if (wnd != null) {
                        wnd.close();
                    }

                    alert('Error\n' + req.responseText);
                }
                else if (wnd != null) {
                    wnd.location.href = url;
                }
            }
        };

        req.open('PUT', url, true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(JSON.stringify({
            filename: document.getElementById("fileName").title,
            data: document.getElementById("image").src
        }));
    }
}
