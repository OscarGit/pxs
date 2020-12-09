package main

import (
	"github.com/opkna/wasmbridge"
)

// SortImage - Sort a image
func SortImage(args []interface{}) (interface{}, error) {
	data := args[0].([]byte)
	return data, nil
}

func main() {
	c := make(chan struct{}, 0)

	wasmbridge.ExportFunc("sortImage", SortImage, true)

	<-c
}
