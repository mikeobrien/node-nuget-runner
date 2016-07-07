var expect = require('chai').expect,
    nuget = require('../src/nuget');

function create(defaults) {
    return nuget(defaults, function(x) { return x; });
}

describe('nuget', function() {

    var nonInteractive = ['-NonInteractive'];
    var configFile = ['-ConfigFile', 'config'];
    var verbosity = ['-Verbosity', 'verbose'];
    var apiKey = ['-ApiKey', 'key'];

    describe('should set path', function() {

        it('to nuget.exe', function() {
            expect(create().update().path).to.equal('nuget.exe');
        });

        it('to default', function() {
            expect(create({ nugetPath: 'path/to/nuget.exe' }).update().path)
                .to.equal('path/to/nuget.exe');
        });

        it('to overrided', function() {
            expect(create({ nugetPath: 'path/to/nuget.exe' })
                .update({ nugetPath: 'another/path/to/nuget.exe' }).path)
                .to.equal('another/path/to/nuget.exe');
        });

    });

    describe('should set options', function() {

        it('with default', function() {
            expect(create({ apiKey: 'key' }).delete().args)
                .to.include('key');
        });

        it('with overrided', function() {
            expect(create({ apiKey: 'key' })
                .delete(null, null, { apiKey: 'key2' }).args)
                .to.include('key2');
        });

    });

    describe('should build config command', function() {

        it('without options', function() {
            expect(create().config({
                "string name": "some value",
                numericName: 5,
                boolName: true
            }).args)
            .to.deep.equal(['config', 
                '-Set', 'string name=some value',
                '-Set', 'numericName=5',
                '-Set', 'boolName=true'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().config({
                "string name": "some value",
                numericName: 5,
                boolName: true
            }, {
                verbosity: 'verbose',
                configFile: 'config' 
            }).args)
            .to.deep.equal(['config', 
                '-Set', 'string name=some value',
                '-Set', 'numericName=5',
                '-Set', 'boolName=true']
                    .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build delete command', function() {

        it('without options', function() {
            expect(create().delete('id', 'version').args).to.deep.equal(
                ['delete', 'id', 'version', '-NoPrompt'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().delete('id', 'version', { 
                    source: 'url',
                    apiKey: 'key',
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['delete', 'id', 'version', '-NoPrompt', '-Source', 'url']
                        .concat(apiKey, verbosity, configFile, nonInteractive));
        });

    });

    describe('should build install command', function() {

        it('without options', function() {
            expect(create().install('package source').args).to.deep.equal(
                ['install', 'package source'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().install('package source', { 
                    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
                    outputDirectory: 'path/to/output/directory',
                    version: '1.0.0',
                    excludeVersion: true,
                    preRelease: true,
                    noCache: true,
                    requireConsent: true,
                    solutionDirectory: 'path/to/solution/directory',
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['install', 'package source',
                     '-Source', 'http://mynugetserver.org',
                     '-Source', 'path/to/source',
                     '-Source', 'ConfigValue',
                     '-OutputDirectory', 'path/to/output/directory',
                     '-Version', '1.0.0',
                     '-ExcludeVersion', '-Prerelease', '-NoCache', '-RequireConsent',
                     '-SolutionDirectory', 'path/to/solution/directory']
                        .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build mirror command', function() {

        it('without options', function() {
            expect(create().mirror('package source', 'list url', 'publish url').args).to.deep.equal(
                ['mirror', 'package source', 'list url', 'publish url']);
        });

        it('with options', function() {
            expect(create().mirror('package source', 'list url', 'publish url', { 
                    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
                    version: '1.0.0',
                    preRelease: true,
                    timeout: 600,
                    noCache: true,
                    noOp: true,
                    apiKey: 'key' 
                }).args)
                .to.deep.equal(
                    ['mirror', 'package source', 'list url', 'publish url',
                     '-Source', 'http://mynugetserver.org',
                     '-Source', 'path/to/source',
                     '-Source', 'ConfigValue',
                     '-Version', '1.0.0',
                     '-Prerelease', 
                     '-Timeout', '600',
                     '-NoCache', '-NoOp']
                        .concat(apiKey));
        });

    });

    describe('should build pack command', function() {

        it('without options', function() {
            expect(create().pack().args).to.deep.equal(
                ['pack'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().pack({ 
                    spec: 'path/to/nuspec', 
                    outputDirectory: 'path/of/output',
                    basePath: 'source/path', 
                    verbose: true,
                    version: '1.0.0.0',
                    exclude: [ '**\\*.log', '**\\.DS_Store' ],
                    symbols: true,
                    tool: true,
                    build: true,
                    noDefaultExcludes: true,
                    noPackageAnalysis: true,
                    includeReferencedProjects: true,
                    excludeEmptyDirectories: true,
                    properties: {
                        name1: 'value1',
                        name2: 'value2'
                    },
                    minClientVersion: '2.5',
                    verbosity: 'verbose'
                }).args)
                .to.deep.equal(
                    ['pack', 'path/to/nuspec',
                     '-OutputDirectory', 'path/of/output',
                     '-BasePath', 'source/path',
                     '-Verbose', 
                     '-Version', '1.0.0.0',
                     '-Exclude', '**\\*.log;**\\.DS_Store',
                     '-Symbols', '-Tool', '-Build', '-NoDefaultExcludes', 
                     '-NoPackageAnalysis', '-IncludeReferencedProjects', 
                     '-ExcludeEmptyDirectories',
                     '-Properties', 'name1=value1;name2=value2',
                     '-MinClientVersion', '2.5']
                        .concat(verbosity, nonInteractive));
        });

    });

    describe('should build push command', function() {

        it('without options', function() {
            expect(create().push('package').args).to.deep.equal(
                ['push', 'package'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().push('package', { 
                    source: 'source', 
                    timeout: 600, 
                    apiKey: 'key',
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['push', 'package',
                     '-Source', 'source',
                     '-Timeout', '600']
                        .concat(apiKey, verbosity, configFile, nonInteractive));
        });

    });

    describe('should build restore command', function() {

        it('without options', function() {
            expect(create().restore().args).to.deep.equal(
                ['restore'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().restore({ 
                    packages: 'package config',
                    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
                    noCache: true,
                    requireConsent: true,
                    packagesDirectory: 'path/to/packages/directory',
                    solutionDirectory: 'path/to/solution/directory',
                    disableParallelProcessing: true,
                    verbosity: 'verbose',
                    configFile: 'config'
                }).args)
                .to.deep.equal(
                    ['restore', 'package config',
                     '-Source', 'http://mynugetserver.org',
                     '-Source', 'path/to/source',
                     '-Source', 'ConfigValue',
                     '-NoCache', '-RequireConsent',
                     '-PackagesDirectory', 'path/to/packages/directory',
                     '-SolutionDirectory', 'path/to/solution/directory',
                     '-DisableParallelProcessing']
                        .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build setApiKey command', function() {

        it('without options', function() {
            expect(create().setApiKey('key').args).to.deep.equal(
                ['setApiKey', 'key'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().setApiKey('key', { 
                    source: 'http://source',
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['setApiKey', 'key', 
                     '-Source', 'http://source']
                        .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build sources command', function() {

        it('without options', function() {
            expect(create().sources('source', 'action').args).to.deep.equal(
                ['sources', 'action', 'source'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().sources('source', 'action', {
                    source: 'http://source',
                    username: 'username',
                    password: 'password',
                    storePasswordInClearText: true,
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['sources', 'action', 'source',
                     '-Source', 'http://source',
                     '-UserName', 'username',
                     '-Password', 'password',
                     '-StorePasswordInClearText' ]
                        .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build spec command', function() {

        it('without options', function() {
            expect(create().spec().args).to.deep.equal(
                ['spec'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().spec({
                    packageId: 'package',
                    assemblyPath: 'assembly/path',
                    force: true,
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args).to.deep.equal(
                    ['spec', 'package',
                     '-AssemblyPath', 'assembly/path',
                     '-Force' ]
                        .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build update command', function() {

        it('without options', function() {
            expect(create().update().args).to.deep.equal(
                ['update'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().update({
                    packages: 'packages',
                    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
                    packageIds: [ 'PackageA', 'PackageB' ],
                    repositoryPath: 'path/to/repository',
                    safe: true,
                    self: true,
                    verbose: true,
                    preRelease: true,
                    fileConflictAction: 'Overwrite',
                    verbosity: 'verbose',
                    configFile: 'config' 
                }).args)
                .to.deep.equal(
                    ['update', 'packages',
                     '-Source', 'http://mynugetserver.org',
                     '-Source', 'path/to/source',
                     '-Source', 'ConfigValue',
                     '-Id', 'PackageA',
                     '-Id', 'PackageB',
                     '-RepositoryPath', 'path/to/repository',
                     '-Safe', '-Self', '-Verbose', '-Prerelease',
                     '-FileConflictAction', 'Overwrite' ]
                         .concat(verbosity, configFile, nonInteractive));
        });

    });

    describe('should build add command', function() {
        it('without options', function() {
            expect(create().add().args).to.deep.equal(
                ['add'].concat(nonInteractive));
        });

        it('with options', function() {
            expect(create().add({
                    nupkg: 'path/to/nuspec',
                    source: '\\\\nuget\\serverpath',
                    expand: true,
                    verbosity: 'verbose'
                }).args)
                .to.deep.equal(
                    ['add', 'path/to/nuspec',
                        '-Source', '\\\\nuget\\serverpath',
                        '-Expand'
                    ]
                    .concat(verbosity, nonInteractive));
        });
    });



});
