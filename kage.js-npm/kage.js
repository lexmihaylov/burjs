#!/usr/bin/env node
var args = process.argv.splice(2);
var printUsage = function() {
    console.log("Usage:");
    console.log("\tkagejs [init|server|build|model|section|view] [<name>|<port>]\n");
    console.log("\tkagejs init - create a project in the current directory");
    console.log("\tkagejs server <port> - start listening for http requests " +
           "using current directory as document root");
   console.log("\tkagejs build [<build.js>] - builds the project by using r.js." +
           " For more info: http://requirejs.org/docs/optimization.html");
   console.log("\tkagejs model (<folder>/<ModelName>|<ModelName>) - "+
           "generates a model in public_html/js/app/models.");
   console.log("\tkagejs section (<folder>/<SectionName>|<SectionName>) - "+
           "generates a section in public_html/js/app/sections.");
   console.log("\tkagejs view (<folder>/<ViewName>|<ViewName>) - "+
           "generates a view in public_html/js/app/templates.");
};

var commands = [
    'init',
    'server',
    'build',
    'model',
    'section',
    'view'
];

var allowedTypes = {
    'model': {
        suffix: 'Model',
        path: process.cwd() + '/public_html/js/app/models/',
        ext: '.js'
    }, 
    'section': {
        suffix: 'Section',
        path: process.cwd() + '/public_html/js/app/sections/',
        ext: '.js'
    },
    
    'view': {
        suffix: null,
        path: process.cwd() + '/public_html/js/app/templates/',
        ext: '.ejs'
    }
};

if(args.length < 1) {
    printUsage();
    process.exit();
}

if(commands.indexOf(args[0]) === -1) {
    printUsage();
    process.exit();
}

if((args[0] !== 'init' && args[0] !== 'build') && args.length < 2) {
    printUsage();
    process.exit();
}

var generate = function(type, filename) {
    if(!allowedTypes[type]) {
        console.error("Undefined type: " + type);
    }
    
    var fs = require('fs');
    var typeSuffix = allowedTypes[type].suffix;
    var filePath = allowedTypes[type].path;
    var extension = allowedTypes[type].ext;
    
    
    var template = fs.readFileSync(__dirname + '/templates/' + type + '.tpl',{
        encoding: 'utf8'
    });
    
    var fileName = filename;
    if(fileName.indexOf('/') !== -1) {
        var path = filename.split('/');
        fileName = path[path.length - 1];
        for(var i = 0; i < path.length - 1; i++) {
            filePath += path[i] + '/';
            if(!fs.existsSync(filePath)) {
                fs.mkdir(filePath);
            }
        }
    }

    if(typeSuffix !== null && !(new RegExp(typeSuffix+'$')).test(fileName)) {
        fileName += typeSuffix;
    }
    
    template = template.replace(/\$\(name\)/g, fileName);
    var generatedFile = filePath + fileName + extension;
    
    if(fs.existsSync(generatedFile)) {
        console.error('File exists: ' + generatedFile);
        proccess.exit();
    }
    
    fs.writeFileSync(generatedFile, template);
    
    console.log(generatedFile + ' - Created');
};

switch (args[0]) {
    case 'init':
        var wrench = require('wrench');
        var fs = require('fs');
        
        if(fs.existsSync('./.kage_project')) {
            console.error('Already a kage.js project.');
            process.exit();
        }
        
        wrench.copyDirSyncRecursive(__dirname + '/templates/project/', process.cwd()+'/public_html', 
        {
            forceDelete: true
        });
        
        fs.mkdir(process.cwd() + '/build');
        fs.mkdir(process.cwd() + '/tests');
        
        var buildTemplate = fs.readFileSync(__dirname + '/templates/build.tpl',{
            encoding: 'utf8'
        });
        fs.writeFileSync('./build.js', buildTemplate);
        fs.writeFileSync('./.kage_project', '');
        
        console.log('+-build/');
        console.log('+-tests/');
        console.log('+-public_html/');
        console.log('  |');
        console.log("  +--css/");
        console.log('  |');
        console.log("  +--js/");
        console.log('  |  |');
        console.log("  |  +--app/");
        console.log('  |  |  |');
        console.log("  |  |  +--helpers/");
        console.log('  |  |  |');
        console.log("  |  |  +--models/");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--BaseModel.js");
        console.log('  |  |  |');
        console.log("  |  |  +--sections/");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--BaseSection.js");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--Main.js");
        console.log('  |  |  |');
        console.log("  |  |  +--templates/");
        console.log('  |  |');
        console.log("  |  +--config/");
        console.log('  |  |  |');
        console.log("  |  |  +--application.js");
        console.log('  |  |');
        console.log("  |  +--libs/");
        console.log('  |  |  |');
        console.log("  |  |  +--jquery.js");
        console.log('  |  |  |');
        console.log("  |  |  +--kage.js");
        console.log('  |  |  |');
        console.log("  |  |  +--require.js");
        console.log('  |  |');
        console.log("  |  +--vendor/");
        console.log('  |  |');
        console.log("  |  +--main.js");
        console.log('  |');
        console.log("  +--resources/");
        console.log('  |');
        console.log("  +--scss/");
        console.log('  |');
        console.log("  +--index.html");
        console.log('kage.js Project Generated.');
        break;
    case 'build':
        var fs = require('fs');
        var buildConfigFile = process.cwd() + '/build.js';
        
        if(args[1]) {
            buildConfigFile = args[1];
        }
        
        if(!fs.existsSync(buildConfigFile)) {
            console.error("Build config file does not exist.");
            process.exit();
        }
        
        var config = fs.readFileSync(buildConfigFile, {
            encoding: 'utf8'
        });
        
        config = eval(config);
        var rjs = require('requirejs');
        rjs.optimize(config);
        break;
    case 'server':
        var connect = require('connect');
        var http = require('http');
        var server = connect().
                use(connect.static(process.cwd())).
                use(connect.logger());
        
        http.createServer(server).
                listen(args[1]);
        break;
    default:
        generate(args[0], args[1]);
        break;
}

