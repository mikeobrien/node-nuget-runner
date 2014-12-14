# nuget-runner

[![npm version](http://img.shields.io/npm/v/nuget-runner.svg)](https://npmjs.org/package/nuget-runner) [![build status](http://img.shields.io/travis/mikeobrien/node-nuget-runner.svg)](https://travis-ci.org/mikeobrien/node-nuget-runner) [![Dependency Status](http://img.shields.io/david/mikeobrien/node-nuget-runner.svg)](https://david-dm.org/mikeobrien/node-nuget-runner) [![npm downloads](http://img.shields.io/npm/dm/nuget-runner.svg)](https://npmjs.org/package/nuget-runner) 

Node wrapper for [Nuget](http://docs.nuget.org/docs/start-here/installing-nuget).

## Install

```bash
$ npm install nuget-runner --save
```

## Usage

First, create a nuget runner, passing in the desired default options. The ones below apply to all or most commands, however any command option can be specified. For example you can specify `noCache: true` to ensure all commands that support that option do not use the cache.

```js
var Nuget = require('nuget-runner');

// Create the nuget instance passing in default options.
var nuget = Nuget({

    // Optional path to the nuget executable. If omitted 
    // nuget.exe must be in the PATH.
    nugetPath: 'path/to/nuget.exe',
            
    // The API key.
    apiKey: '78a53314-c2c0-45c6-9d92-795b2096ae6c',

    // Display this amount of details in the output.
    verbosity: 'normal|quiet|detailed',

    // The NuGet configuation file. If not specified, file 
    // %AppData%\NuGet\NuGet.config is used as configuration file.
    configFile: 'path/to/nuget.config'

});
```
These defaults can be selectively overridden in the individual command options.

 ```js
var nuget = Nuget({ verbosity: 'quiet' });

nuget.push(..., { verbosity: 'detailed' })
```

All commands return a [promise](https://github.com/kriskowal/q). Success returns `stdout`:

```js
nuget.push(...)
    .done(function(stdout) {
        console.log(stdout);
    });
```

Failure returns the error:

```js
nuget.push(...)
    .fail(function(error) {
        console.log(error.message);
    });
```

The following are the supported commands and options. 

## Config

Sets NuGet config values. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Config_Command) for more details.

```js
nuget.config({

        name1: 'value1',
        name2: 'value2' 

    }, 

    // Options
    {

        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Delete

Deletes a package from the server. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Delete_Command) for more details.

```js
nuget.delete(

    // Id of the package.
    'PackageId', 

    // Version of the package.
    '1.0',       
    
    // Options
    {            
        
        // Specifies the server URL.
        source: 'http://mynugetserver.org',

        apiKey: '78a53314-c2c0-45c6-9d92-795b2096ae6c',
        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Install

Installs a package using the specified sources. If no sources are specified, all sources defined in `%AppData%\NuGet\NuGet.config` are used. If NuGet.config specifies no sources, uses the default NuGet feed. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Install_Command) for more details.

```js
nuget.install(

    // Specify the package id. Or if a path to a packages.config file is 
    // used instead of an id, all the packages it contains are installed.
    'PackageId|path/to/packages.config', 

    // Options
    {
        
        // A list of packages sources to use for the install.
        // Can either be a path, url or config value.
        source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
            
        // Specifies the directory in which packages will be installed. 
        // If none specified, uses the current directory.
        outputDirectory: 'path/to/output/directory',
            
        // The version of the package to install.
        version: '1.0.0.0',
            
        // If set, the destination directory will contain only 
        // the package name, not the version number.
        excludeVersion: true,
            
        // Allows prerelease packages to be installed. This flag is not required 
        // when restoring packages by installing from packages.config.
        preRelease: true,
            
        // Disable looking up packages from local machine cache.
        noCache: true,
            
        // Checks if package restore consent is granted before installing a package.
        requireConsent: true,
            
        // Solution root for package restore.
        solutionDirectory: 'path/to/solution/directory',

        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Mirror

Mirrors a package and its dependencies from the specified source repositories to the target repository. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Mirror_Command) for more details.

```js
nuget.mirror(

    // Specify the id of the package to mirror. If a path to a 
    // packages.config file is used instead of a package id, all 
    // the packages it contains are mirrored to the given version 
    // (if specified) or latest otherwise.
    'PackageId|path/to/packages.config', 

    // The url of the list target repository.
    'http://list.nugetserver.org', 

    // The url of the publish target repository.
    'http://target.mynugetserver.org', 

    // Options
    {
        
        // A list of packages sources to use for the finding packages to mirror. 
        // If no sources are specified, the ones defined in the default NuGet config 
        // file are used. If the default NuGet config file specifies no sources, 
        // uses the default NuGet feed. Can either be a path, url or config value.
        source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
            
        // The version of the package to install. If not specified, latest 
        // version is mirrored.
        version: '1.0.0.0',
            
        // When set, "latest" when specifying no version for a package id (as command 
        // argument or in packages.config) includes pre-release packages.
        preRelease: true,
            
        // Specifies the timeout for pushing to a server in seconds. Defaults to 
        // 300 seconds (5 minutes).
        timeout: 600,
            
        // By default a local cache is used as a fallback when a package or a 
        // package dependency is not found in the specified source(s). If you 
        // want to ensure only packages from the specified sources are used, 
        // set the NoCache option. If you want instead to maximize chances 
        // of finding packages, do not set this option.
        noCache: true,
            
        // Log what would be done without actually doing it. Assumes success 
        // for push operations.
        noOp: true,

        apiKey: '78a53314-c2c0-45c6-9d92-795b2096ae6c'

    });
```

## Pack

Creates a NuGet package based on the specified nuspec or project file. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Pack_Command) for more details.

```js
nuget.pack({

    // Specify the location of the nuspec or project file to create a package.
    spec: 'path/to/nuspec|path/to/project/file', 

    // Specifies the directory for the created NuGet package file. 
    // If not specified, uses the current directory.
    outputDirectory: 'path/of/output',

    // The base path of the files defined in the nuspec file.
    basePath: 'source/path', 

    // Shows verbose output for package building.
    verbose: true,

    // Overrides the version number from the nuspec file.
    version: '1.0.0.0',

    // Specifies one or more wildcard patterns to exclude when creating a package.
    exclude: [ '**\\*.log', '**\\.DS_Store' ],

    // Determines if a package containing sources and symbols should be created. 
    // When specified with a nuspec, creates a regular NuGet package file and 
    // the corresponding symbols package.
    symbols: true,

    // Determines if the output files of the project should be in the tool folder.
    tool: true,

    // Determines if the project should be built before building the package.
    build: true,

    // Prevent default exclusion of NuGet package files and files and folders 
    // starting with a dot e.g. .svn.
    noDefaultExcludes: true,

    // Specify if the command should not run package analysis after building 
    // the package.
    noPackageAnalysis: true,

    // Include referenced projects either as dependencies or as part of the package. 
    // If a referenced project has a corresponding nuspec file that has the same name 
    // as the project, then that referenced project is added as a dependency. Otherwise, 
    // the referenced project is added as part of the package.
    includeReferencedProjects: true,

    // Prevent inclusion of empty directories when building the package.
    excludeEmptyDirectories: true,

    // Provides the ability to specify properties when creating a package.
    properties: {

        name1: 'value1',
        name2: 'value2'

    },

    // Set the minClientVersion attribute for the created package. This value will 
    // override the value of the existing minClientVersion attribute (if any) in 
    // the .nuspec file.
    minClientVersion: '2.5',

    verbosity: 'normal|quiet|detailed'

});
```

## Push

Pushes a package to the server and publishes it. NuGet's default configuration is obtained by loading `%AppData%\NuGet\NuGet.config`, then loading any nuget.config or `.nuget\nuget.config` starting from root of drive and ending in current directory. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Push_Command) for more details.

```js
nuget.push(

    // Specify the path to the package.
    'path/to/package/file', 

    // Options
    {

        // Specifies the server URL. If not specified, nuget.org is used unless 
        // `DefaultPushSource` config value is set in the NuGet config file. Starting 
        // with NuGet 2.5, if NuGet.exe identifies a UNC/folder source, it will 
        // perform the file copy to the source.
        source: '\\\\mycompany\\repo',
            
        // Specifies the timeout for pushing to a server in seconds. Defaults to 
        // 300 seconds (5 minutes).
        timeout: 600,

        apiKey: '78a53314-c2c0-45c6-9d92-795b2096ae6c',
        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Restore

Downloads and unzips (restores) any packages missing from the packages folder. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Restore_command) for more details.

```js
nuget.restore({

    // Specify the solution path or path to a packages.config file.
    packages: 'path/to/solution.sln|path/to/packages.config', 
    
    // A list of packages sources to use for the install.
    // Can either be a path, url or config value.
    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],
        
    // Disable using the machine cache as the first package source.
    noCache: true,
        
    // Checks if package restore consent is granted before restoring a package.
    requireConsent: true,
        
    // Specifies the packages directory.
    packagesDirectory: 'path/to/solution/directory',
        
    // Specifies the solution directory. Not valid when restoring packages 
    // for a solution.
    solutionDirectory: 'path/to/solution/directory',
        
    // Disable parallel nuget package restores.
    disableParallelProcessing: true,

    verbosity: 'normal|quiet|detailed',
    configFile: 'path/to/nuget.config'

});
```

## Set API Key

Saves an API key for a given server URL. When no URL is provided API key is saved for the NuGet gallery. See [here](http://docs.nuget.org/docs/reference/command-line-reference#SetApiKey_Command) for more details.

```js
nuget.setApiKey(

    // Specify the API key to save.
    '78a53314-c2c0-45c6-9d92-795b2096ae6c', 

    // Options
    {

        // Server URL where the API key is valid.
        source: 'http://mynugetserver.org',

        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Sources

Provides the ability to manage list of sources located in `%AppData%\NuGet\NuGet.config`. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Sources_Command) for more details.

```js
nuget.sources(

    // Name of the source.
    'Source name', 

    // Action to perform on the source.
    'Add|Remove|Enable|Disable|Update', 

    // Options
    {

        // Path to the package(s) source.
        source: 'path/to/sources',

        // UserName to be used when connecting to an authenticated source.
        username: 'username',

        // Password to be used when connecting to an authenticated source.
        password: 'p@$$w0rd',

        // Do not encrypt the password and store it in clear text.
        storePasswordInClearText: true, 

        verbosity: 'normal|quiet|detailed',
        configFile: 'path/to/nuget.config'

    });
```

## Spec

Generates a nuspec for a new package. If this command is run in the same folder as a project file (`.csproj`, `.vbproj`, `.fsproj`), it will create a tokenized nuspec file. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Spec_Command) for more details.

```js
nuget.spec({

    // Id of the package.
    packageId: 'MyPackage', 

    // Assembly to use for metadata.
    assemblyPath: 'MyAssembly.dll',

    // Overwrite nuspec file if it exists.
    force: true,   

    verbosity: 'normal|quiet|detailed',
    configFile: 'path/to/nuget.config'

});
```

## Update

Update packages to latest available versions. This command also updates NuGet.exe itself. Please note that the presence of Packages folder is required to run the Update command. A recommended way is to run NuGet.exe Restore command first before running the Update command. See [here](http://docs.nuget.org/docs/reference/command-line-reference#Update_Command) for more details.

```js
nuget.update({
            
    // Specify the solution path or path to a packages.config file.
    packages: 'path/to/solution.sln|path/to/packages.config', 

    // A list of package sources to search for updates.
    source: ['http://mynugetserver.org', 'path/to/source', 'ConfigValue'],

    // Package ids to update.
    packageIds: [ 'PackageA', 'PackageB' ],

    // Path to the local packages folder (location where packages are installed).
    repositoryPath: 'path/to/repository',

    // Looks for updates with the highest version available within the same 
    // major and minor version as the installed package.
    safe: true,

    // Update the running NuGet.exe to the newest version available from the server.
    self: true,

    // Show verbose output while updating.
    verbose: true,

    // Allows updating to prerelease versions. This flag is not required when 
    // updating prerelease packages that are already installed.
    preRelease: true,

    // The action to take, when asked to overwrite or ignore existing files 
    // referenced by the project.
    fileConflictAction: 'Overwrite|Ignore|None',

    verbosity: 'normal|quiet|detailed',
    configFile: 'path/to/nuget.config'

});
```

## License
MIT License
