const fs = require('fs');
const path = require('path');

const ComponentRootDir = path.resolve(__dirname, '../../src/components');

function getComponentNames() {
	const dirs = fs.readdirSync(ComponentRootDir,{withFileTypes: true});
	return dirs.filter(componentDir => {
		if(!componentDir.isDirectory()) return false;
		return fs.existsSync(`${ComponentRootDir}/${componentDir.name}/index.ts`);
	}).map(componentDir => {
		return `${componentDir.name}`;
	});
}

function createIndexFile(){
	let componentNameList = getComponentNames();
	let importComponents = '';
	let componentStr = '';
	componentNameList.sort()
		.map(name => {
			importComponents += `import ${name} from './${name}'\n`;
			componentStr += `\t${name},\n`
		});
	let fileContent = `import { VueConstructor } from 'vue/types';\n${importComponents
		}\nconst components = {\n${componentStr
	}};\nconst install = (Vue: VueConstructor) => {
  Object.keys(components).forEach(key => {
    Vue.component('l-' + key,components[key]);
  });
};
export default {
${componentStr}\tinstall
};`;

	console.log(fileContent);
	fs.writeFileSync(path.join(ComponentRootDir, '/index.ts'), fileContent);
}

createIndexFile();
