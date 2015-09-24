#!/bin/bash
set -e

ROOT=/opt/puppet/current
LOG_DIR=/tmp/lig4_worker_log/
LOG_FILE=$LOG_DIR/`date +%Y-%m-%d-%H-%M-%S`.log

export BASH_XTRACEFD=1
set -x
mkdir -p $LOG_DIR

export PATH=$PATH:/usr/local/bin
make -C $ROOT  worker > $LOG_FILE
