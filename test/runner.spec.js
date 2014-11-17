var expect = require('chai').expect,
    path = require('path'),
    runner = require('../src/runner');

function run(args) {
    return runner({ 
        path: path.join(__dirname, 'ConsoleApp.exe'), 
        args: args });   
}

describe('runner', function() {

    it('should successfully execute and pass args', function(done) {
        run([ 'echo', 'oh', 'hai' ])
            .done(function(stdout) {
                expect(stdout).to.deep.equal(['oh, hai']);
                done();
            });
    });

    it('should qualify args with spaces', function(done) {
        run([ 'echo', 'oh hai' ])
            .done(function(stdout) {
                expect(stdout).to.deep.equal(['oh hai']);
                done();
            });
    });

    it('should fail on non zero exit code', function(done) {
        run([ 'return', '5' ])
            .fail(function(error) {
                expect(error.code).to.equal(5);
                expect(error.stdout).to.deep.equal(['Error 5']);
                expect(error.stderr).to.be.empty();
            })
            .done(function() { done(); });
    });

    var exceptionMessage =
        "Unhandled Exception:System.Exception: oh noes!" + 
        "  at ConsoleApp.Program.Main (System.String[] args) " +
        "[0x00000] in <filename unknown>:0 " +
        "[ERROR] FATAL UNHANDLED EXCEPTION: System.Exception: " +
        "oh noes!  at ConsoleApp.Program.Main (System.String[] " +
        "args) [0x00000] in <filename unknown>:0 ";

    it('should fail on exception', function(done) {
        run([ 'exception', 'oh noes!' ])
            .fail(function(error) {
                expect(error.code).to.equal(1);
                expect(error.stdout).to.be.empty();
                expect(error.stderr.join('').replace(/\n/g, ''))
                            .to.deep.equal(exceptionMessage);
            })
            .done(function() { done(); });
    });

});
