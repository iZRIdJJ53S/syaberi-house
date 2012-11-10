module.exports =
  server:
    host: "ec2-176-34-2-152.ap-northeast-1.compute.amazonaws.com:8010"
    port: 8010
    ssl:
      port: 4430
      key: 'certs/2012-syaberi-private.key'
      cert: 'certs/ca.cer'
    cookieSecret: 'xZQWzsaY8fZWFnVltP1Y'
    cookieMaxAge: 1000 * 60 * 60 * 24 * 7 #1week
    hashSalt: 'l7UmWFjvQIoaX6kThcng'
    workerNum: 2 #クラスターで起動するワーカー数
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
      welcome: 'SYABERI-HOUSEへようこそ！'
      deactivation: 'SYABERI-HOUSEのご退会'  # 退会時
      profile: 'SYABERI-HOUSEのプロフィールが変更されました'  # プロフィール変更時
