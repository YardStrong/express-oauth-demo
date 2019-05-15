oauth2 认证客户端
项目没有使用数据库，没有配置session，只是举个简单的例子

## 一、主要功能模块

MVC 框架 -------------- express
oauth 模块 ------------ client-oauth2

## 二、oauth2客户端配置

配置文件 profiles/profile-development.js

## 三、项目启动

+ 项目入口 ``node lib/starter.js``

+ 项目API

```
/auth 登陆页
/auth/callback 回调域
```
