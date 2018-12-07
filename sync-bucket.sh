#!/bin/bash

aws s3 sync build s3://lite-brite.pixodev.net --acl public-read
