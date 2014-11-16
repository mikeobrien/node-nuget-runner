var commands = require('./commands'),
    processRunner = require('./runner');

module.exports = function(defaults, runner) {
    var command = commands(defaults);
    var run = runner || processRunner;
    return {
        config: function(settings, options) { return run(command('config', [ settings ], options)); }, 
        delete: function(packageId, packageVersion, options) { 
            return run(command('delete', [ packageId, packageVersion ], options)); }, 
        install: function(packages, options) { 
            return run(command('install', [ packages ], options)); }, 
        mirror: function(packages, listRepositoryUrl, publishRepositoryUrl, options) { 
            return run(command('mirror', [ packages, listRepositoryUrl, publishRepositoryUrl ], options)); }, 
        pack: function(options) { return run(command('pack', [], options)); }, 
        push: function(package, options) { return run(command('push', [ package ], options)); }, 
        restore: function(options) { return run(command('restore', [], options)); }, 
        setApiKey: function(apiKey, options) { return run(command('setApiKey', [ apiKey ], options)); }, 
        sources: function(source, action, options) { return run(command('sources', [ source, action ], options)); }, 
        spec: function(options) { return run(command('spec', [], options)); }, 
        update: function(options) { return run(command('update', [], options)); }            
    }
};