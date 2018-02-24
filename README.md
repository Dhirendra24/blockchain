# blockchain

## Setup Instructions
- Install Docker
- Install docker-compose
- Run `docker-compose up miner-1`

###Available APIs:
- Add Author.  Ex: `curl -H "Content-type:application/json" --data '{"author": "author1"}' http://localhost:3001/addAuthor`
- Add Content.  Ex: `curl -H "Content-type:application/json" --data '{"content" : "content1", "author": "author1"}' http://localhost:3001/addContent`
