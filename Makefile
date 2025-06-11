build: 
	docker build -t anti_spam_bot .
run:
	docker run --name anti_spam_bot -e KAFKA_BROKER=kafka:9092 anti_spam_bot
kill:
	docker rm -f anti_spam_bot