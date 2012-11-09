moduleexports =
  server:
    host: "websocket.syaberi-house.com"
    port: 3000
    ssl:
      port: 4430
      key: 'certs/2012-syaberi-private.key'
      cert: 'certs/ca.cer'
    cookieSecret: 'xZQWzsaY8fZWFnVltP1Y'
    cookieMaxAge: 1000 * 60 * 60 * 24 * 7 #1week
    hashSalt: 'l7UmWFjvQIoaX6kThcng'
  mysql:
    host: '10.160.29.212'
    user: 'syaberi_house'
    password: '12345'
    database: 'syaberi_house'
  mysql_lb:
    host: 'mysql-lb-1166312433.ap-northeast-1.elb.amazonaws.com'
    user: 'syaberi_house'
    password: '12345'
    database: 'syaberi_house'
  redis:
    host: '10.160.29.212'
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
