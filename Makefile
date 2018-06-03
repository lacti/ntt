all: docker-build-push desktop-package

travis: docker-build-push docker-desktop-package

docker-build-push:
	docker-compose build && \
	docker-compose push

docker-desktop-package:
	docker pull lacti/node-awscli && \
	docker run -it \
		-e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
		-e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
		-e "AWS_DEFAULT_REGION=ap-northeast-2" \
		-v "$(shell pwd):/project" \
		lacti/node-awscli \
		make desktop-package

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

