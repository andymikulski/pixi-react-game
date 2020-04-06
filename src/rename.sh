#!/bin/bash
let COUNTER = 0
for filename in *; do
  COUNTER=$[$COUNTER +1]
  mv $filename frame_00$COUNTER.png
done