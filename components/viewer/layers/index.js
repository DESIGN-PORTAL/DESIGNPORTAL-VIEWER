const types = [
  'Background',
  'Text',
  'Image',
];

// 组件前置命名 确保不会跟html内置标签重名
export const preName = 'Dp';

// 页面组件
const componentsVars = {};

types.forEach(type => {
  componentsVars[`${preName}${type}`] = require(`./${type}`).default;
});

export const components = componentsVars;
