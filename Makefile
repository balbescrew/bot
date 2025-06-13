build: 
	docker build -t demianight/anti_spam_bot:latest .
run:
	docker run --name anti_spam_bot -e KAFKA_BROKER=62.113.119.235:30092 anti_spam_bot
kill:
	docker rm -f anti_spam_bot
push:
	docker push demianight/anti_spam_bot:latest
prod:
	docker buildx build --platform linux/amd64 -t demianight/anti_spam_bot:latest --push .
