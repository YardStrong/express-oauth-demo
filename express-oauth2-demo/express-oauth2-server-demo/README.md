oauth2 认证服务端
官方例子(没有使用数据库)(https://github.com/gerges-beshay/oauth2orize-examples.git)

## 一、主要功能模块

+ MVC 框架 -------------- express
+ oauth 模块 ------------ oauth2orize
+ 权限控制模块 ----------- passport
+ mongodb 数据库 -------- mongoose
+ redis 数据库 ---------- redis

## 二、数据库

+ mongodb --- 用户信息，客户端信息存储
+ redis ----- session 信息、code信息、token信息存储

> 如果不使用 redis，则需要更改 session和其它信息存储配置
> session存储配置 toolkit/sessionKit.js;app.js
> 其它信息存储配置 toolkit/redisKit.js;toolkit/passport.js;lib/controller/oauth2Controller.js

#### mongodb要求

数据库 test， 集合 user 和 client

```bash
> use test
> db.client.insertOne({"appID":"12345678901", "appName":"jfoeja", "secretKey":"pff3232938u98jfj3p214u29ffh3h2af3u", "redirectURI" :"http://localhost:3001/oauth/callback"})
> db.user.insertOne({"account":"account", "password":"password"})
```


## 三、项目启动

+ 项目入口 ``node lib/starter.js``

+ 项目API

```
/toLogin 登陆页
/toLogout 退出登陆

/home
/home/info 本地登陆权限接口

/api/getApiVersion 令牌授权api接口
```
