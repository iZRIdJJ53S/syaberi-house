module.exports =
  server:
    host: "ec2-54-248-153-207.ap-northeast-1.compute.amazonaws.com:3000"
    port: 3000
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
