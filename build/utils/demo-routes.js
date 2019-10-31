const fs = require('fs');
const path = require('path');

const ComponentRootDir = path.resolve(__dirname, '../../src/components');

function getComponentNames() {
	const dirs = fs.readdirSync(ComponentRootDir,{withFileTypes: true});
	return dirs.filter(componentDir => {
		if(!componentDir.isDirectory()) return false;
		return fs.existsSync(`${ComponentRootDir}/${componentDir.name}/Demo/index.vue`);
	}).map(componentDir => {
		return `${componentDir.name}`;
	});
}

function getCamelName(name) {
	let itemList = name.split('-');
	let newName = '';
	itemList.forEach( value => {
		newName += value.charAt(0).toUpperCase() + value.substr(1);
	});
	return newName;
}

function createRouterFile(){
	const componentNames = getComponentNames();
	let routerList = '\nlet routers = [\n';
	let importComponents = '';
	componentNames.sort()
		.map(name => {
			let componentName = getCamelName(name);
			let routerName = componentName.charAt(0).toLowerCase() + componentName.substr(1);
		routerList += `\t{
\t\tname: "${routerName}",
\t\tpath: "/${routerName}",
\t\tcomponent: ${componentName},
\t},`;
		importComponents += `import ${componentName} from 'src/components/${name}/demo/index.vue'\n`;
	});
	routerList += '\n];\n';

	let fileContent = `${importComponents
	}${routerList
	}\nexport default routers;`;
	console.log('\n');
	fs.writeFileSync(path.join(__dirname, '../../example/src/routes.ts'), fileContent);
}

createRouterFile();
