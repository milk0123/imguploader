


/**
 * 常量
 */

// 文件类型
const FILETYPE = [
    'image/png', 'image/gif', 'image/jpg', 'image/jpeg'
];

// 文件大小
const MAXSIZE = 1024*1204*2;

// 绑定一次
let ONCE = 1;
/**
 * @function vertifyFileType - 校验文件类型
 * @param {Array} files - 文件
 * @callback ck - 回调函数
 * @param {Array} files - 返回过滤后的文件
 */

function vertifyFileType(files, ck) {
    files = toArray(files);

    // 文件校验 这个可以放在另一个js文件中
    for(var i = 0; i < files.length; i++) {
        var file = files[i];
        var type = file.type;
        // 校验文件格式
        if ( FILETYPE.indexOf(type) === -1) {
            // 执行回调函数
            ck();
            // 剔除掉错误格式的文件
            files.splice(i, 1);
        }
    }

    return files;

}

/**
 * @function vertifyFileSize - 校验文件大小
 * @param {Array} files - 文件
 * @callback ck - 回调函数
 * @param {Array} files - 返回过滤后的文件
 */

function vertifyFileSize (files, ck) {
    files = toArray(files);

    // 文件校验 这个可以放在另一个js文件中
    for(var i = 0; i < files.length; i++) {
        var file = files[i];
        var size = file.size;
        // 校验文件格式
        if ( size > MAXSIZE ) {
            // 执行回调函数
            ck();
            // 剔除掉错误格式的文件
            files.splice(i, 1);
        }
    }

    return files;

}

/**
 * @function formatImg - 转成图片
 * @param {Array | Object} files - 文件
 * @return {Object} imgNode - img对象
 */
function formatImg(files, ck) {

    var images = [];
    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        var file = files[i];
        reader.readAsDataURL(file);
    
        reader.onload = function() {
            // 生成元素
            var image = document.createElement('section');
            image.innerHTML = `
                <div class='img-thumb-box'>
                    <img class='img-thumb' src='${this.result}' alt='img'>
                    <i class='btn--close'>X</i>
                </div>
            `;
            images.push(image);
            if ( images.length === files.length ) {
                ck(images);
            }
        }
    }
}
/**
 * @function formatOnlineImg - 转换网络图片
 * @param {String} URL - 网络连接
 * @callback ck - 回调函数
 */
function formatOnlineImg(URL, ck) {
    var images = [];
    // 判断是否是图片
    var image = new Image();
    image.src = URL;
    image.onload = function() {
      if (this.width > 0 && this.height > 0) {
        // 生成元素
        var image = document.createElement('section');
        image.innerHTML = `
            <div class='img-thumb-box'>
                <img class='img-thumb' src='${this.src}' alt='img'>
                <i class='btn--close'>X</i>
            </div>
        `;
        images.push(image);
        ck(images);
      }
    }
    image.onerror = function() {
        ck([]);
    }
}

/**
 * @function appendElement - 添加元素节点
 * @param {*} el - 父节点 className
 * @param {*} children  - 子节点
 */
function appendElement( el, children ) {
    // 加入缩略图盒子
    var imgsBox = document.querySelector( '.' + el);
    var fragment = document.createDocumentFragment();

    // 添加进元素片段中
    children.forEach(element => {
        fragment.appendChild(element);
    });

    imgsBox.appendChild(fragment);

    // 添加点击事件
    var closeBtns = document.querySelectorAll('.btn--close');
    closeBtns.forEach(element => {
        if (!element.onclick) {
            element.onclick = function() {
                // 移除当前元素
                var ancestorNode = this.parentNode.parentNode.parentNode;
                var parentNode = this.parentNode.parentNode;
                ancestorNode.removeChild(parentNode);
            };
        }
    });
}

// 判断数组
function isArray(arr) {
    return (arr instanceof Array)
}

// 转换成数组
function toArray(arr) {
    if ( isArray(arr) ) {
        return arr;
    }
    console.log('once');
    var newArr = [].slice.call(arr);
    return newArr;
}

export default {
    vertifyFileType,
    vertifyFileSize,
    formatImg,
    formatOnlineImg,
    appendElement,
}