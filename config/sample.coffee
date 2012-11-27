module.exports =
  server:
    host: "syaberi-house.com"
    port: 3000
    ssl:
      port: 4430
      key: 'certs/private.key'
      cert: 'certs/ca.cer'
    cookieSecret: 'h2chFUXZKmPEMF58ttxA'
    cookieMaxAge: 1000 * 60 * 60 * 24 * 7 #1week
    hashSalt: 'yZRbsrHwaP4jXUuVwNfC'
    workerNum: 2 #クラスターで起動するワーカー数
  mysql:
    host: 'mysql host'
    user: 'mysql user'
    password: 'mysql password'
    database: 'database name'
  mysql_lb:
    host: 'mysql load_balancer'
    user: 'mysql user'
    password: 'mysql password'
    database: 'database name'
  redis:
    host: 'redis server'
    port: 'redis port'
  twitter:
    consumerKey: ''
    consumerSecret: ''
  mail:
    host: 'smtp.gmail.com'
    user: 'mail user'
    password: 'mail password'
    from: ''
    subject:
      welcome: 'SYABERI-HOUSEへようこそ！'
      deactivation: 'SYABERI-HOUSEのご退会'  # 退会時
      profile: 'SYABERI-HOUSEのプロフィールが変更されました'  # プロフィール変更時
