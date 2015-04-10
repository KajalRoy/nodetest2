#!/bin/sh

load_file() {
  local INPUT_FILE=$1
  [ -z "${INPUT_FILE}" ] && echo "ERROR: File not specified" && return 1

  echo "Loading file ${INPUT_FILE}"

  COLLECTION=`echo user`

  FIELDS=`head -1 ${INPUT_FILE}`

  echo $FIELDS

  echo "mongoimport -d datasystem -c ${COLLECTION} -type csv --headerline ${INPUT_FILE} -f $FIELDS --verbose > '/Users/kajroy/Documents/node/nodetest2/data/log/lastUpdateLog.txt'"
  time mongoimport -d datasystem -c ${COLLECTION} -type csv --headerline ${INPUT_FILE} -f $FIELDS --verbose > '/Users/kajroy/Documents/node/nodetest2/data/log/lastUpdateLog.txt'
  return 0
}

main() {
  load_file $1
}

main $*
exit 0
