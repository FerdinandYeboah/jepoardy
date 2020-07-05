#Run as ./run.sh

#Serve with nginx
export NGINX_PORT=80
export NGINX_JEOPARDY_FOLDER=$PWD/nginx
export NGINX_LOG_PATH=$PWD/nginx
export NGINX_BUILT_FOLDER_PATH=$PWD/build
./nginx/run-nginx.sh