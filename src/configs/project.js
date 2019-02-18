// import packageJson from '../../package.json';
// console.log(packageJson);
const packageJson=require('../../package.json');
const data= {
  // base: 'Domainantifraud',
  base: packageJson.Domain.contextPath,
  appName: 'DOMAIN反欺诈系统',
}
module.exports.default = module.exports = data