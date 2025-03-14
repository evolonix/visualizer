import { join } from '@degreed/core-angular';
import { MergeTagsPlugin } from '@degreed/tinymce';
import { Editor } from 'tinymce';

MergeTagsPlugin();

/**
 * This is the configuration for the TinyMCE editor.
 */
export const buildConfiguration = (cdnUrl: string) => ({
  base_url: join(cdnUrl || '/', 'tinymce'),
  suffix: '.min',

  // Open source plugins for the free version of the editor
  plugins:
    'advlist autolink autoresize autosave charmap code directionality emoticons fullscreen help image importcss link lists media preview save searchreplace table visualblocks visualchars wordcount dgmergetags',
  menu: {
    insert: {
      title: 'Insert',
      items:
        'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime | dgmergetags',
    },
  },
  menubar: 'edit insert view format table tools degreed help',
  toolbar:
    'fontfamily fontsize | dgmergetags | bold italic underline | forecolor backcolor | align bullist numlist table | link  image media emoticons | code fullscreen preview',

  placeholder: 'Enter Content',

  help_tabs: ['shortcuts', 'keyboardnav'],
  branding: false,
  promotion: false,
  // toolbar_mode: 'wrap' as ToolbarMode, // Hack above to declare ToolbarMode type
  min_height: 360,
  toolbar_sticky: true,
  toolbar_sticky_offset: 64,
  skin_url: join(cdnUrl || '/', 'tinymce/skins/ui/apollo'),

  block_formats: 'Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6; Paragraph=p',

  // In emails we rarely use target for links so we hide the target drop down in the link dialog
  // https://www.tiny.cloud/docs/tinymce/6/link/#link_target_list
  link_target_list: false,

  // We don't want users to be able to resize images by using drag and drop because it can break layout templates.
  // https://www.tiny.cloud/docs/tinymce/6/content-behavior-options/#object_resizing
  object_resizing: false,

  paste_block_drop: true, // Block drag and drop of images into the editor

  elementpath: false, // Hide the element path in the status bar

  mergetags_list: [
    {
      title: 'User',
      menu: [
        {
          value: 'User.FullName',
          title: 'Full Name',
        },
        {
          value: 'User.FirstName',
          title: 'First Name',
        },
        {
          value: 'User.Email',
          title: 'Email',
        },
      ],
    },
    {
      title: 'Organization',
      menu: [
        {
          value: 'Organization.ID',
          title: 'Org ID',
        },
        {
          value: 'Organization.Name',
          title: 'Organization Name',
        },
      ],
    },
    {
      title: 'Date',
      menu: [
        {
          value: 'Date',
          title: 'Current Date',
        },
        {
          value: 'Time',
          title: 'Current Time',
        },
      ],
    },
    {
      title: 'Job',
      menu: [
        {
          value: 'JobRole',
          title: 'JobRole',
        },
        {
          value: 'JobTitle',
          title: 'JobTitle',
        },
      ],
    },
  ],

  setup: (editor: Editor) => {
    editor.on('focus', (e) => {
      e.target.editorContainer.classList.toggle('focused');
    });

    editor.on('blur', (e) => {
      e.target.editorContainer.classList.toggle('focused');
    });
  },
});
