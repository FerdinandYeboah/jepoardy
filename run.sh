#Run as ./run.sh

#Build static files and copy to root?
npm run build
mkdir -p ~/sites/jeopardy/build
cp -r build ~/sites/jeopardy/build

#Serve with nginx
export NGINX_JEOPARDY_FOLDER=$PWD/nginx
export NGINX_LOG_PATH=$PWD/nginx
export NGINX_BUILT_FOLDER_PATH=$PWD/build
./nginx/run-nginx.sh