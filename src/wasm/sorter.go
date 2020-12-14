package main

import (
	"errors"
	"fmt"
	"math"

	"github.com/opkna/wasmbridge"
)

func quickSort(data []byte, bpp, start, end int, desc bool) {
	if start >= end {
		return
	}

	pivot := data[((start+end)/(2*bpp))*bpp]
	l, r := start, end
	for l < r {
		if desc {
			if data[l] < data[r] {
				for i := 0; i < bpp; i++ {
					tmp := data[l+i]
					data[l+i] = data[r+i]
					data[r+i] = tmp
				}
			}

			if data[l] >= pivot {
				l += bpp
			}
			if data[r] < pivot {
				r -= bpp
			}
		} else {
			if data[l] > data[r] {
				for i := 0; i < bpp; i++ {
					tmp := data[l+i]
					data[l+i] = data[r+i]
					data[r+i] = tmp
				}
			}

			if data[l] <= pivot {
				l += bpp
			}
			if data[r] > pivot {
				r -= bpp
			}
		}
	}
	quickSort(data, bpp, start, r-bpp, desc)
	quickSort(data, bpp, r+bpp, end, desc)
}

func calcLumin(data []byte, i int) float32 {
	sum := int(data[i]) + int(data[i+1]) + int(data[i+2])
	return float32(sum) / 765
}
func calcSaturation(data []byte, i int) float32 {
	s := 1.0 / 255.0
	r, g, b := float64(data[i])*s, float64(data[i+1])*s, float64(data[i+2])*s
	max := math.Max(r, math.Max(g, b))
	min := math.Min(r, math.Min(g, b))
	if max == min {
		return 0
	}
	if (max + min) > 1 {
		return float32((max - min) / (2 - max - min))
	}
	return float32((max - min) / (max + min))
}
func calcHue(data []byte, i int) float32 {
	scale := 1.0 / 255.0
	r, g, b := float64(data[i])*scale, float64(data[i+1])*scale, float64(data[i+2])*scale
	max := math.Max(r, math.Max(g, b))
	min := math.Min(r, math.Min(g, b))
	if r == max {
		return float32(((g - b) / (max - min)) / 6)
	} else if g == max {
		return float32((2 + (b-r)/(max-min)) / 6)
	}
	return float32((4 + (r-g)/(max-min)) / 6)
}
func calcRaw(data []byte, i int) float32 {
	sum := (uint32(data[i]) << 16) | (uint32(data[i+1]) << 8) | uint32(data[i+2])
	return float32(sum) / 16777215 // 256^3
}

func getOptions(options map[string]interface{}) (string, bool, float32, float32, bool, string, string) {
	return options["selectBy"].(string), // How to select pixels to sort (brightness, saturation, hue, raw)
		options["invert"].(bool), // Inverting the range
		float32(options["lowerRange"].(float64)), // Lower bounds of range
		float32(options["upperRange"].(float64)), // Upper bounds of range
		options["desc"].(bool), // Sorting descending
		options["direction"].(string), // Direction of sort (horizontal/vertical)
		options["sortBy"].(string) // Value to sort by (brightness, saturation, hue, raw)
}

func sortRow(data []byte, width, bpp int, desc bool, inRange func([]byte, int) bool) {
	firstX := -1
	for i := 0; i < width; i += bpp {
		if inRange(data, i) {
			if firstX == -1 {
				firstX = i
			}
		} else {
			if firstX != -1 {
				lastX := i - bpp
				// Sort
				quickSort(data, bpp, firstX, lastX, desc)
				firstX = -1
			}
		}
	}
	if firstX != -1 {
		lastX := width - bpp
		// Sort
		quickSort(data, bpp, firstX, lastX, desc)
	}
}

// SortImage - Sort a image
func SortImage(args []interface{}) (interface{}, error) {
	data := args[0].([]byte)                    // Pixel data in bytes
	width := int(args[1].(float64))             // Width in pixels
	height := int(args[2].(float64))            // Height in pixels
	bpp := int(args[3].(float64))               // Bytes per pixel
	options := args[4].(map[string]interface{}) // Soring options

	if len(data) != width*height*bpp {
		return nil, errors.New("Mismatch between data length and width/height")
	}

	selectBy, invert, lowerRange, upperRange, desc, direction, sortBy := getOptions(options)

	// True if sort direction is horizontal
	horizontal := direction == "horizontal"

	// Set function that will be used to get the value used to select pixels
	var getValue func([]byte, int) float32
	switch selectBy {
	case "brightness":
		getValue = calcLumin
	case "saturation":
		getValue = calcSaturation
	case "hue":
		getValue = calcHue
	case "raw":
		getValue = calcRaw
	default:
		return nil, fmt.Errorf("Unknown 'selectBy' value: %s", selectBy)
	}
	inRange := func(data []byte, i int) bool {
		v := getValue(data, i)
		if invert {
			return v <= lowerRange || v >= upperRange
		}
		return v >= lowerRange && v <= upperRange
	}

	switch sortBy {
	default:
		break
	}

	// Get all rows to be sorted as separet slices
	var rows [][]byte
	var rowSize int
	if horizontal {
		// Get all the rows
		rowSize = width * bpp
		rows = make([][]byte, height)
		for r := range rows {
			rows[r] = make([]byte, width*bpp)
			for x := range rows[r] {
				rows[r][x] = data[r*width*bpp+x]
			}
		}
	} else { // Vertical
		// Convert colums to rows
		rowSize = height * bpp
		rows = make([][]byte, width)
		for c := range rows {
			rows[c] = make([]byte, rowSize)
			for y := 0; y < rowSize; y += bpp {
				i := c*bpp + y*width
				for d := 0; d < bpp; d++ {
					rows[c][y+d] = data[i+d]
				}
			}
		}
	}

	for i := range rows {
		_, _, _, _ = rowSize, i, desc, inRange
		sortRow(rows[i], rowSize, bpp, desc, inRange)
	}

	// Copy back the sorted pixels to the data slice
	if horizontal {
		i := 0
		for y := range rows {
			for x := range rows[y] {
				data[i] = rows[y][x]
				i++
			}
		}
	} else { // Vertical
		for x := 0; x < width; x++ {
			for y := 0; y < height*bpp; y += bpp {
				i := x*bpp + y*width
				for d := 0; d < bpp; d++ {
					data[i+d] = rows[x][y+d]
				}
			}
		}
	}

	return data, nil
}

func main() {
	wasmbridge.ExportFunc("sortImage", SortImage, true)

	select {}
}
