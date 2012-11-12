/******************************************************************
 * syaberi-houseアプリケーションを複数プロセス立ち上げる起動スクリプト。
 * 複数のCPUのコアを活用する場合はapp.jsを直接使用せずこちらを実行する。
 *
 * usage: $ node cluster.js
 ******************************************************************/

var cluster = require('cluster');
var config = require('config');

if (cluster.isMaster) {
  console.log('master:', process.pid);
  cluster.setupMaster({
    exec: 'app.js',
    args: []
  });
  for (var i = 0; i < config.server.workerNum; i++) {
    cluster.fork();
  }

  cluster.on('disconnect', function(worker, address) {
    console.log('worker %d is disconnected.', worker.id);
  });

  cluster.on('exit', function(worker, code, signal) {
    var exitCode = signal ? 'signal: ' + signal
                          : 'exitcode: ' + code;
    console.log('worker %d exited with %s', worker.id, exitCode);

    if (!worker.suicide) {
      //disconnectによる切断でない場合はワーカーを再起動
      console.log('restarting a worker %d.', worker.id);
      cluster.fork();
    }
  });
}
