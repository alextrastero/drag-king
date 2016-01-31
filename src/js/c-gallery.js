var trade = require('./trade.js');

function getRandomColor() {
    function c() {
        return Math.floor(Math.random()*256).toString(10)
    }
    console.log('c-gallery:getRandomColor', "rgba("+c()+","+c()+","+c()+", 0.2)");
    return "rgba("+c()+","+c()+","+c()+", 0.2)";
}

var node;
module.exports = (function () {

    function appendImage(path) {
        var container = document.createElement('div'),
            imgNode = document.createElement('div'),
            clipNode = document.createElement('div'),
            removeBtn = document.createElement('div'),
            myImage = new Image();


        container.className = 'gallery-image-wrap';
        container.style.backgroundColor = getRandomColor();
        myImage.src = path;
        myImage.addEventListener('load', function () {
            container.classList.add('c-loaded');
            container.style.backgroundColor = 'transparent';
        });
        imgNode.style.backgroundImage = "url(" + path + ")";
        imgNode.className = 'img';
        removeBtn.className = 'deleteBtn octicon octicon-trashcan';
        clipNode.className = 'copyClipNode';
        container.appendChild(imgNode);
        imgNode.appendChild(removeBtn);
        imgNode.appendChild(clipNode);
        container.appendChild(myImage);

        removeBtn.setAttribute('title', 'remove this image');

        // register click listener for the remove duel request
        removeBtn.addEventListener('click', function () {
          trade.doCall('deleteFile')(path, function () {
              container.remove();
          })
        });
        return container;
    }

    function appendFile(file) {
        var container = document.createElement('div'),
            icon = document.createElement('span'),
            removeBtn = document.createElement('div'),
            openButton = document.createElement('a'),
            textNode = document.createTextNode(file.name);


        container.className = 'gallery-file-wrap';
        openButton.className = 'open-btn octicon octicon-file-symlink-file';
        container.style.backgroundColor = getRandomColor();

        icon.className = "file-icon octicon octicon-file-text";

        removeBtn.className = 'deleteBtn octicon octicon-trashcan';
        icon.appendChild(textNode);
        openButton.appendChild(icon);
        container.appendChild(removeBtn);
        container.appendChild(openButton);

        removeBtn.setAttribute('title', 'remove this file');

        // register click listener for the remove duel request
        openButton.setAttribute('href', 'http://' + location.host + file.file);
        openButton.setAttribute('target', '_blank');
        openButton.setAttribute('title', 'Open in new tab');


        removeBtn.addEventListener('click', function () {
            trade.doCall('deleteFile')(file.file, function () {
                container.remove();
            })
        });

        return container;
    }

    trade.on({
        getFiles : function (data) {
            data.forEach(function (file) {
                if(/image\/.*/.test(file.type)) {
                    node.appendChild(appendImage(file.file));
                } else {
                    node.appendChild(appendFile(file));
                }
            });
        },
        fileSend : function (file) {
            // only interest in images
            if(/image\/.*/.test(file.type)){
                node.appendChild(appendImage([file.file]));
            } else {
                node.appendChild(appendFile(file));
            }
        }
    });

    return {
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {

        }
    }
}());




