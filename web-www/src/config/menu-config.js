module.exports = [{
  path: '/moji-admin',
  name: 'Manage',
  id: 'basic',
  sub: [
    {
      path: 'admin-add',
      name: 'Admin add',
      componentName: 'admin-add'
    },
    {
      path: 'moji-upload',
      name: 'Moji upload',
      componentName: 'moji-upload'
    },
    {
      path: 'moji',
      name: 'Moji',
      componentName: 'moji'
    },
    {
      path: 'moji-set',
      name: 'Moji Set',
      componentName: 'moji-set'
    },
    {
      path: 'article',
      name: 'Article',
      componentName: 'article-list'
    }
  ]
// }, {
//   name: 'Form',
//   id: 'form',
//   sub: [{
//     name: 'Radio 单选框',
//     componentName: 'FormRadio'
//   }, {
//     name: 'Checkbox 多选框',
//     componentName: 'FormCheckbox'
//   }]
}]
