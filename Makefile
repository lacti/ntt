all: docker-build-push desktop-package

docker-build-push:
	docker-compose build && \
	docker-compose push

desktop-package:
	cd web && \
		yarn install && \
		yarn build:electron && \
		cd - && \
	cd desktop && \
		yarn install && \
		cd src && \
			yarn install --production && \
			cd - && \
		yarn pack:all && \
		./upload_dist.sh && \
		cd -

