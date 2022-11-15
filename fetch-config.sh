#!/usr/bin/env bash

region="eu-west-1"

mkdir -p ~/.gu/
aws s3 cp s3://guconf-flexible/atom-workshop/atom-workshop.conf ~/.gu/atom-workshop.conf --profile composer --region $region
