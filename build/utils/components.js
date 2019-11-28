const fs = require('fs');
const path = require('path');

const ComponentRootDir = path.resolve(__dirname, '../../src/components');
const StyleBaseDir = path.resolve(__dirname, '../../src/style');

function getComponentNames() {
	const dirs = fs.readdirSync(ComponentRootDir,{withFileTypes: true});
	return dirs.filter(componentDir => {
		if(!componentDir.isDirectory()) return false;
		return fs.existsSync(`${ComponentRootDir}/${componentDir.name}/index.ts`);
	}).map(componentDir => {
		return `${componentDir.name}`;
	});
}

function getBaseStyleContent(styleDir=StyleBaseDir, base='../style') {
	const dirs = fs.readdirSync(styleDir,{withFileTypes: true});
	let styleContent = '';
	dirs.map(componentDir => {
		if(componentDir.isDirectory()){
			styleContent += getBaseStyleContent(`${styleDir}/${componentDir.name}`, '../'+base)
		}else {
			styleContent += `@import '${base}/${componentDir.name.replace('.less', '')}';\n`
		}
	});
	return styleContent;
}

function getCamelName(name) {
	let itemList = name.split('-');
	let newName = '';
	itemList.forEach( value => {
		newName += value.charAt(0).toUpperCase() + value.substr(1);
	});
	return newName;
}

function createIndexFile(){
	let componentNameList = getComponentNames();
	let importComponents = '';
	let componentStr = '';
	let styleContent = getBaseStyleContent();

	componentNameList.sort()
		.map(name => {
			let componentName = getCamelName(name);
			importComponents += `import ${componentName} from './${name}'\n`;
			componentStr += `\t${componentName},\n`;
			if(fs.existsSync(`${ComponentRootDir}/${name}/index.less`)){
				styleContent += `@import './${name}/index';\n`
			}
		});
	let fileContent = `import { VueConstructor } from 'vue/types';\n${
		"import {LApp} from '../utils/LApp';\n" +
		"import {setup as Setup} from '../utils/Setup';\n"
		}${importComponents
		}\nconst components = {\n${componentStr
	}};\nconst install = (Vue: VueConstructor) => {
\tSetup(Vue);
\tObject.keys(components).forEach(key => {
\t\tVue.component('L' + key,components[key]);
\t});
};
export default {
${componentStr}\tinstall,\n\tLApp
};`;

	// console.log(fileContent);
	fs.writeFileSync(path.join(ComponentRootDir, '/index.js'), fileContent);
	fs.writeFileSync(path.join(ComponentRootDir, '/index.less'), styleContent);
}

createIndexFile();
