#Generate config from template. 
#NGINX_LOG_PATH, NGINX_BUILT_FOLDER_PATH, NGINX_JEOPARDY_FOLDER environment variables should be set for this script to work
envsubst '${NGINX_LOG_PATH} ${NGINX_BUILT_FOLDER_PATH}' < $NGINX_JEOPARDY_FOLDER/static-webserver.template.conf > $NGINX_JEOPARDY_FOLDER/static-webserver.conf

#Run nginx with custom config
sudo nginx -c $NGINX_JEOPARDY_FOLDER/static-webserver.conf

# sudo nginx -t -c $PWD/nginx/static-webserver.conf