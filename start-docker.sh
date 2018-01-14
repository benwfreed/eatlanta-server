#!/bin/bash
pwd
cd /home/ec2-user/eatlanta-server
docker-compose down
docker-compose up -d
