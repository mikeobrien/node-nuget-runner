var expect = require('chai').expect,
    path = require('path'),
    process = require('../src/process');

function run(args) {
    return process({ 
        path: path.join(__dirname, 'ConsoleApp.exe'), 
        args: args });   
}

describe('process', function() {

    it('should successfully execute and pass args', function(done) {
        run([ 'echo', 'oh', 'hai' ])
            .done(function(stdout) {
                expect(stdout).to.deep.equal('oh, hai');
                done();
            });
    });

    it('should qualify args with spaces', function(done) {
        run([ 'echo', 'oh hai' ])
            .done(function(stdout) {
                expect(stdout).to.deep.equal('oh hai');
                done();
            });
    });

    it('should fail on non zero exit code', function(done) {
        run([ 'return', '5' ])
            .fail(function(error) {
                expect(error.message).to.equal('Nuget failed: Error 5');
            })
            .done(function() { done(); });
    });

    var exceptionMessage =
        "Nuget failed: UnhandledException:System.Exception:ohnoes!" + 
        "at ConsoleApp.Program.Main(System.String[]args) " +
        "[0x00000]in<filename unknown>:0" +
        "[ERROR]FATALUNHANDLEDEXCEPTION:System.Exception:" +
        "ohnoes! atConsoleApp.Program.Main(System.String[] " +
        "args)[0x00000]in<filename unknown>:0";

    it('should fail on exception', function(done) {
        run([ 'exception', 'oh noes!' ])
            .fail(function(error) {
                expect(error.message.replace(/\s/g, ''))
                    .to.equal(exceptionMessage.replace(/\s/g, ''));
            })
            .done(function() { done(); });
    });

});
