import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {Editor as TinymceEditor} from '@tinymce/tinymce-react';
import tinymce from 'tinymce';


const Editor = ({
  value,
  onChange = () => {
  },
  module,
  width,
  change,
}, ref) => {

  const editorRef = useRef(null);

  const editorSave = () => {
    return editorRef.current.getContent();
  };

  useImperativeHandle(ref, () => ({
    editorSave,
  }));

  useEffect(() => {
    // tinymce.init({
    //   selector: 'editor',  // change this value according to your HTML
    //   plugins: 'autoresize'
    // });

  }, []);

  const toobar = () => {
    switch (module) {
      case 'PHYSICALDETAIL':
        return ['actionsInkind'];
      case 'POSITIONS':
        return ['actionsPosition'];
      case 'SKU':
        return ['actionsSku'];
      default:
        return [];
    }
  };


  return (
    <div style={{width}}>
      <TinymceEditor
        id="editor"
        apiKey="no-api-key"
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        initialValue={value}
        init={{
          language: 'zh_CN',
          branding: false,
          // height: 'auto',
          width: '100%',
          menubar: false,
          plugins: ['advlist', 'autolink', 'autolink'
            , 'lists', 'link', 'image', 'charmap', 'print', 'autoresize', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount', 'editorPlugins'],
          toolbar: ['undo redo', ...toobar(), 'formatselect', 'fontsizeselect', 'bold italic backcolor', 'alignleft aligncenter', 'alignright alignjustify', 'bullist numlist outdent indent', 'table', 'actionsImg', 'removeformat', 'help'].join(' | ')
        }}
        onBlur={() => {
          if (!module || change) {
            onChange(editorRef.current.getContent());
          }
        }}
      />


    </div>
  );
};

export default React.forwardRef(Editor);
