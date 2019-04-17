# drawio-webdav

采用webdav方式存储drawio文件的解决方案

目前实现
- 存储到minio

待实现
- 存储到dzzoffice
- 存储到nextcloud

## TODO

- [ ] 增加内网部署 draw.io

## DEMO

**使用docker**

`docker run --rm -p 3000:3000 itrizon/drawio-webdav:demo`

浏览器访问： `http://127.0.0.1:3000/?filename=a_file`

**本地部署**

```bash
git clone https://github.com/othorizon/drawio-webdav.git
cd drawio-minio
npm install
npm start
```

浏览器访问： `http://127.0.0.1:3000/?filename=any_filename`
