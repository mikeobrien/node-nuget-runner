var _ = require('underscore');

var commands = {

    config: function(settings, options) {
        var args = [ 'config' ];
        Object.keys(settings).forEach(function(name) { 
            args.push('-Set', name + '=' + settings[name]); });
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    delete: function(packageId, packageVersion, options) { 
        var args = [ 'delete', packageId, packageVersion, '-NoPrompt' ];
        if (options.source) args.push('-Source', options.source);
        addApiKey(args, options);
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    install: function(packages, options) { 
        var args = [ 'install', packages ];
        if (options.source && options.source.length > 0) 
            options.source.forEach(function(x) { args.push('-Source', x); });
        if (options.outputDirectory) args.push('-OutputDirectory', options.outputDirectory);
        if (options.version) args.push('-Version', options.version);
        if (options.excludeVersion) args.push('-ExcludeVersion');
        if (options.preRelease) args.push('-Prerelease');
        if (options.noCache) args.push('-NoCache');
        if (options.requireConsent) args.push('-RequireConsent');
        if (options.solutionDirectory) args.push('-SolutionDirectory', options.solutionDirectory);
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    mirror: function(packageSource, listRepositoryUrl, publishRepositoryUrl, options) { 
        var args = [ 'mirror', packageSource, listRepositoryUrl, publishRepositoryUrl ];
        if (options.source && options.source.length > 0) 
            options.source.forEach(function(x) { args.push('-Source', x); });
        if (options.version) args.push('-Version', options.version);
        if (options.preRelease) args.push('-Prerelease');
        if (options.timeout) args.push('-Timeout', String(options.timeout));
        if (options.noCache) args.push('-NoCache');
        if (options.noOp) args.push('-NoOp');
        addApiKey(args, options);
        return args;
    },
        
    pack: function(options) { 
        var args = [ 'pack' ];
        if (options.spec) args.push(options.spec);
        if (options.outputDirectory) args.push('-OutputDirectory', options.outputDirectory);
        if (options.basePath) args.push('-BasePath', options.basePath);
        if (options.verbose) args.push('-Verbose');
        if (options.version) args.push('-Version', options.version);

        if (options.exclude && options.exclude.length > 0) 
            args.push('-Exclude', options.exclude.join(';'));

        if (options.symbols) args.push('-Symbols');
        if (options.tool) args.push('-Tool');
        if (options.build) args.push('-Build');
        if (options.noDefaultExcludes) args.push('-NoDefaultExcludes');
        if (options.noPackageAnalysis) args.push('-NoPackageAnalysis');
        if (options.includeReferencedProjects) args.push('-IncludeReferencedProjects');
        if (options.excludeEmptyDirectories) args.push('-ExcludeEmptyDirectories');

        if (options.properties)
            args.push('-Properties', Object.keys(options.properties)
                .map(function(name) { return name + '=' + options.properties[name]; }).join(';'));

        if (options.minClientVersion) args.push('-MinClientVersion', options.minClientVersion);

        addVerbosity(args, options);
        addNonInteractive(args);
        return args;
    },
        
    push: function(package, options) { 
        var args = [ 'push', package ];
        if (options.source) args.push('-Source', options.source);
        if (options.timeout) args.push('-Timeout', String(options.timeout));
        addApiKey(args, options);
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    restore: function(options) { 
        var args = [ 'restore' ];
        if (options.packages) args.push(options.packages);
        if (options.source && options.source.length > 0) 
            options.source.forEach(function(x) { args.push('-Source', x); });
        if (options.noCache) args.push('-NoCache');
        if (options.requireConsent) args.push('-RequireConsent');
        if (options.packagesDirectory) args.push('-PackagesDirectory', options.packagesDirectory);
        if (options.solutionDirectory) args.push('-SolutionDirectory', options.solutionDirectory);
        if (options.disableParallelProcessing) args.push('-DisableParallelProcessing');
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    setApiKey: function(apiKey, options) { 
        var args = [ 'setApiKey', apiKey ];
        if (options.source) args.push('-Source', options.source);
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    sources: function(source, action, options) { 
        var args = [ 'sources', action, source ];
        if (options.source) args.push('-Source', options.source);
        if (options.username) args.push('-UserName', options.username);
        if (options.password) args.push('-Password', options.password);
        if (options.storePasswordInClearText) args.push('-StorePasswordInClearText');
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    spec: function(options) { 
        var args = [ 'spec' ];
        if (options.packageId) args.push(options.packageId);
        if (options.assemblyPath) args.push('-AssemblyPath', options.assemblyPath);
        if (options.force) args.push('-Force');
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    },
        
    update: function(options) {
        var args = [ 'update' ];
        if (options.packages) args.push(options.packages);
        if (options.source && options.source.length > 0) 
            options.source.forEach(function(x) { args.push('-Source', x); });
        if (options.packageIds && options.packageIds.length > 0) 
            options.packageIds.forEach(function(x) { args.push('-Id', x); });
        if (options.repositoryPath) args.push('-RepositoryPath', options.repositoryPath);
        if (options.safe) args.push('-Safe');
        if (options.self) args.push('-Self');
        if (options.verbose) args.push('-Verbose');
        if (options.preRelease) args.push('-Prerelease');
        if (options.fileConflictAction) args.push('-FileConflictAction', options.fileConflictAction);
        addVerbosity(args, options);
        addConfigFile(args, options);
        addNonInteractive(args);
        return args;
    }
    
}

function addApiKey(args, options) {
    if (options.apiKey) args.push('-ApiKey', options.apiKey);
}

function addConfigFile(args, options) {
    if (options.configFile) args.push('-ConfigFile', options.configFile);
}

function addVerbosity(args, options) {
    if (options.verbosity) args.push('-Verbosity', options.verbosity);
}

function addNonInteractive(args, options) {
    args.push('-NonInteractive');
}

module.exports = function(defaults) {
    defaults = _.extend({ nugetPath: 'nuget.exe' }, defaults);
    return function(command, args, options) {
        options = _.extend({}, defaults, options);
        return {
            options: options,
            path: options.nugetPath,
            args: commands[command].apply(this, args.concat(options))
        }
    }
}