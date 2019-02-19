// import packageJson from '../../package.json';
// console.log(packageJson);
const packageJson=require('../../package.json');
const data= {
  // base: 'Domainantifraud',
  base: packageJson.Domain.contextPath,
  appName: '壹小食',
}
module.exports.default = module.exports = data