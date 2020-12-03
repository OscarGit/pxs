package main

import (
	"github.com/OscarGit/wasmbridge"
)

// Add - Add two numbers
func sortImage(args []interface{}) (interface{}, error) {
	data := args[0].([]byte)
	return data, nil
}

func main() {
	c := make(chan struct{}, 0)

	wasmbridge.ExportFunc("sortImage", sortImage)

	<-c
}
