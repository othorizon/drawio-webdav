# drawio-minio

一个通过minio作为存储介质的drawio流程图绘制程序

# DEMO

## 使用docker

`docker run --rm -p 3000:3000 itrizon/drawio-minio:demo`

浏览器访问： `http://127.0.0.1:3000/?filename=a_file`

## 本地部署

```bash
git clone https://github.com/othorizon/drawio-minio.git
cd drawio-minio
npm install
npm start
```

浏览器访问： `http://127.0.0.1:3000/?filename=a_file`
