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

function createRouterFile(){
	const componentNames = getComponentNames();
	let routerList = '\nlet routers = [\n';
	let importComponents = '';
	componentNames.sort()
		.map(name => {
		routerList += `\t{
\t\tname: "${name}",
\t\tpath: "/${name}",
\t\tcomponent: ${name},
\t},`;
		importComponents += `import ${name} from 'src/components/${name}/demo/index.vue'\n`;
	});
	routerList += '\n];\n';

	let fileContent = `${importComponents
	}${routerList
	}\nexport default routers;`;
	console.log('\n');
	fs.writeFileSync(path.join(__dirname, '../../example/src/routes.ts'), fileContent);
}

createRouterFile();
