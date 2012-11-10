module.exports =
  server:
    host: "127.0.0.1:4430"
    port: 3000
    ssl:
      port: 4430
      key: 'certs/dev.key'
      cert: 'certs/dev.crt'
    cookieSecret: 'xZQWzsaY8fZWFnVltP1Y'
    cookieMaxAge: 1000 * 60 * 60 * 24 * 7 #1week
    hashSalt: 'l7UmWFjvQIoaX6kThcng'
    workerNum: 4 #クラスターで起動するワーカー数
  mysql:
    host: '127.0.0.1'
    user: 'syaberi_house'
    password: '12345'
    database: 'syaberi_house'
  mysql_lb:
    host: '127.0.0.1'
    user: 'syaberi_house'
    password: '12345'
    database: 'syaberi_house'
  redis:
    host: '127.0.0.1'
    port: '6379'
  twitter:
    consumerKey: 'l0q1e0LElofACmRM1ezEg'
    consumerSecret: 's0QLpzahToMVq4ToM0NeqGPDVO2pPTYjdkQBPBq0'
  mail:
    host: 'smtp.gmail.com'
    user: 'syaberihouse'
    password: 'syaberihouse0110'
    from: 'syaberi-house <syaberihouse@gmail.com>'
    subject:
      welcome: 'SYABERI-HOUSEへようこそ！'   # 入会時
      deactivation: 'SYABERI-HOUSEのご退会'  # 退会時
      profile: 'SYABERI-HOUSEのプロフィールが変更されました'  # プロフィール変更時
