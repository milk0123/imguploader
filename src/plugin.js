import style from './css/style';
import form from './js/main';

const plugin = (editor) => {
  'use strict';

  

  /**
   * @function openDialog - 打开通知对话框
   * @param {Object} editor - 编辑器对象
   * @param {String} text - 提示文字
   * @param {String} dType - 对话框类型
   *                 dType:  info / success / warning / error
   * @param {Number} duration - 持续时间
   */
  function notification(editor, text, dType, duration) {
    editor.notificationManager.open({
      text: text,
      type: dType,
      timeout: duration || 1500,
      closeButton: false,
    })
  }
  // 打开弹窗
  function open(editor) {
    editor.windowManager.open({
      title: '本地图片上传',
      width: 500,
      height: 450,
      html: `
        ${style}
        <div class='mce-box-content'>
          <section class='online-img-box'>
            <input class='img-online' type='url' placeholder='请输入网络图片链接' />
            <button class='img-submit'>确定</button>
          </section>
          <label for='img-file' class='img-uploader'>
              上传本地文件
              <input id='img-file' class='js-img-file' type='file' multiple='multiple' name='file' accept="image/png, image/jpeg, image/gif, image/jpeg"  hidden />
          </label>
          <h2 class='title'>上传的图片</h2>
          <div class='imgs-box'>
          </div>
        </div>
      `,
      buttons: [
        {
          text: '确定',
          subtype: 'primary',
          onclick: function(e) {
            // 上传图片

            // 关闭弹窗
            editor.windowManager.close();
          }
        },
        {
          text: '取消',
          onclick: function() {
            // 关闭弹窗
            editor.windowManager.close();
          }
        }
      ]
    })
  }

 

  // 注册命令
  function commandRegister (editor) {
    editor.addCommand('mceImgUpload', function() {
      // 打开弹窗
      open(editor);

      // 获取到文件
      var fileInput = document.querySelector('.js-img-file');

      // 本地获取图片
      fileInput.addEventListener('change', function(e) {

        var files = e.target.files;

        // 校验文件类型
        files = form.vertifyFileType(files, function() {
          notification(editor, '文件类型错误!', 'error');
        });

        // 校验文件大小
        files = form.vertifyFileSize(files, function() {
          notification(editor, '文件不能超过2M!', 'error');
        })

        // 转成图片
        form.formatImg(files, function(images) {
          console.log(images, files);
          form.appendElement('imgs-box' , images);
          
        });
      }, false);

      // 网络获取图片
      var submitBtn = document.querySelector('.img-submit');

      submitBtn.addEventListener('click', function() {
        var file = document.querySelector('.img-online');
        // 获取链接
        var URL = file.value;

        if (!URL) {
          return;
        }
        form.formatOnlineImg(URL, function(images) {
          console.log(images);
          if (images.length === 0) {
            notification(editor, '请勿上传非图片链接!', 'error');
            return;
          }
          form.appendElement('imgs-box', images);
        })
        
      }, false);

    })
  }

  // 注册按钮
  function buttonRegister(editor) {
    
    editor.addButton('imguploader', {
      text: '',
      icon: 'image',
      cmd: 'mceImgUpload'
    });
  }

  function initPlugin(editor) {
    commandRegister(editor);
    buttonRegister(editor);
  }

  // 初始化插件
  initPlugin(editor);
};

export default plugin;
