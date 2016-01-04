var child = require('child_process'),
    Q = require('q');

module.exports = function run(command) {
    command.options = command.options || {};
    var windows = process.platform === 'win32';
    var path = windows ? command.path : 'mono';
    var args =  command.args;

    if (!windows) command.args.unshift(command.path);

    if (command.options.verbosity !== 'quiet') {
        console.log();
        console.log(path + ' ' + args.join(' '));
        console.log();
    }

    var nuget = child.spawn(path, args, {
        cwd: command.options.cwd
    });

    var log = function(message) { 
        message = message.toString('utf8');
        console.log(message); 
        return message;
    };

    var stdout = '';
    var stderr = '';

    nuget.stdout.on('data', function(message) { stdout += log(message); });
    nuget.stderr.on('data', function(message) { stderr += log(message); });

    var deferred = Q.defer();

     nuget
        .on('error', function (err) {
            deferred.reject(err);
        })
        .on('exit', function(code) { 
            if (code > 0) {
                var error = stderr || stdout;
                var message = 'Nuget failed' + (error ? 
                    ': ' + error : '.');
                deferred.reject(new Error(message));
            }
            else deferred.resolve(stdout);
        });  

    return deferred.promise;
};